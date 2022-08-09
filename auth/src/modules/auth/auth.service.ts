import { ConflictException, HttpStatus, Inject, Logger } from "@nestjs/common";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import respondWith from "src/common/helpers/respondWith";
import { AuthRepository } from "./contracts";
import { UserDocument, UserInfoI, UserInfoWithoutPassword, UserRegisterInfo } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { BcryptHeleprsI } from "src/common/utilities";
import * as DTOs from "./dto";
import { userInfoSerializer } from "./serializers";
import { JwtService } from "@nestjs/jwt";

export default class AuthService {

    constructor(
        @Inject('AuthLogger') private readonly logger: Logger,
        @Inject('AuthRepository') private readonly authRepository: AuthRepository,
        @Inject('bcryptHelpers') private readonly bcryptHelpers: BcryptHeleprsI,
        private jwtService: JwtService,

    ) { }

    private createAccessToken(user: UserInfoI): string {
        this.logger.verbose(`getAccessTokenForUser service started`);
        const accessToken = this.jwtService.sign({ email: user.email, ts: new Date().getTime() });
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
        return userInfoSerializer(user.email, user.isVerified);
    }

    async signup({ email, password }: UserRegisterInfo): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
        this.logger.log(`Signup - Request is created with email: [${email}]`);
        const emailExists = await this.authRepository.findByEmail(email);
        if (emailExists) {
            throw new ConflictException('Email is already registered');
        }
        const hashedPassword = await this.bcryptHelpers.hash(password);
        const data: UserDocument = { email, password: hashedPassword, isVerified: false, activationCode: uuidv4() };
        const user = await this.authRepository.createUser(data);
        // TODO, KAFKA TO EMAIL SERVICE
        return respondWith(HttpStatus.CREATED, 'User Registered successfully');
    }

    async signin(user: UserInfoWithoutPassword): Promise<SuccessResponseDTO<DTOs.SigninResponse>> {
        this.logger.log(`Signin - Request is created with email: [${user.email}]`);
        const accessToken = this.createAccessToken(user);
        return respondWith(HttpStatus.OK, 'Successfull login', { ...user, accessToken }, DTOs.SigninResponse);
    }
}