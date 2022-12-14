import { ConflictException, ForbiddenException, HttpStatus, Inject, Logger, UnauthorizedException } from "@nestjs/common";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import respondWith from "src/common/helpers/respondWith";
import { AuthRepository } from "./contracts";
import { UserDocument, UserInfoI, UserInfoWithoutPassword, UserRegisterInfo } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { BcryptHeleprsI } from "src/common/utilities";
import * as DTOs from "./dto";
import { userInfoSerializer } from "./serializers";
import { JwtService } from "@nestjs/jwt";
import { ClientKafka } from "@nestjs/microservices";
import UserCreatedEvent from "./events/userCreated.event";
import { KAFKA_EVENTS } from "./events";

export default class AuthService {

    constructor(
        @Inject('AuthLogger') private readonly logger: Logger,
        @Inject('AuthRepository') private readonly authRepository: AuthRepository,
        @Inject('bcryptHelpers') private readonly bcryptHelpers: BcryptHeleprsI,
        @Inject('MAIL_SERVICE') private readonly mailClient: ClientKafka,
        private jwtService: JwtService,

    ) { }

    createAccessToken(user: UserInfoI): string {
        this.logger.log(`getAccessTokenForUser service started`);
        const accessToken = this.jwtService.sign({ fullName: user.fullName, userId: user.userId, email: user.email, ts: new Date().getTime() });
        return accessToken;
    }

    async validateUser(email: string, password: string): Promise<UserInfoWithoutPassword | boolean> {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            return false;
        }
        const isMatching = await this.bcryptHelpers.verify(password, user.password);
        if (!isMatching) {
            return false;
        }
        return userInfoSerializer(user._id, user.fullName, user.email, user.isVerified);
    }

    async signup({ email, password, fullName }: UserRegisterInfo): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
        this.logger.log(`Signup - Request is created with email: [${email}]`);
        const emailExists = await this.authRepository.findByEmail(email);
        if (emailExists) {
            throw new ConflictException('Email is already registered');
        }
        const hashedPassword = await this.bcryptHelpers.hash(password);
        const data: UserDocument = { fullName, email, password: hashedPassword, isVerified: false, verificationCode: uuidv4() };
        await this.authRepository.createUser(data);
        this.mailClient.emit(KAFKA_EVENTS.user_created, new UserCreatedEvent(data.fullName, data.email, data.verificationCode));
        return respondWith(HttpStatus.CREATED, 'User Registered successfully');
    }

    async signin(user: UserInfoWithoutPassword): Promise<SuccessResponseDTO<DTOs.SigninResponse>> {
        this.logger.log(`Signin - Request is created with email: [${user.email}]`);
        const accessToken = this.createAccessToken(user);
        return respondWith(HttpStatus.OK, 'Successfull login', { ...user, accessToken }, DTOs.SigninResponse);
    }

    async verifyEmail(verifyDTO: DTOs.VerifyBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
        this.logger.log(`verifyEmail - Request is created with token: [${verifyDTO.token}]`);
        const user = await this.authRepository.findByToken(verifyDTO.token);
        if (!user) {
            this.logger.debug(`verifyEmail - token not found [${verifyDTO.token}]`);
            throw new ForbiddenException('Token is invalid');
        }

        const isMatching = await this.bcryptHelpers.verify(verifyDTO.password, user.password);
        if (!isMatching) {
            throw new UnauthorizedException('You\'re not authorized to perform this action');
        }

        const updatedUser = await this.authRepository.verifyEmail(verifyDTO.token);
        if (!updatedUser.modifiedCount) {
            this.logger.debug(`verifyEmail - Email is already verified [${verifyDTO.token}]`);
            throw new ConflictException('Email is already verified');
        }
        return respondWith(HttpStatus.OK, 'Email have been verified successfully');
    }
}