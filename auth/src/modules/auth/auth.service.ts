import { ConflictException, HttpStatus, Inject, Logger } from "@nestjs/common";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import respondWith from "src/common/helpers/respondWith";
import { AuthRepository } from "./contracts";
import * as DTOs from "./dto"
import { UserDocument } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { BcryptHeleprsI } from "src/common/utilities";

export default class AuthService {

    constructor(
        @Inject('AuthLogger') private readonly logger: Logger,
        @Inject('AuthRepository') private readonly authRepository: AuthRepository,
        @Inject('bcryptHelpers') private readonly bcryptHelpers: BcryptHeleprsI
    ) { }

    async signup({ email, password }: DTOs.SignupBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
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
}