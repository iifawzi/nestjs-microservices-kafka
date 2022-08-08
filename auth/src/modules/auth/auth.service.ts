import { Inject, Logger } from "@nestjs/common";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import respondWith from "src/common/helpers/respondWith";
import { AuthRepository } from "./auth.contract";
import * as DTOs from "./dto"

export default class AuthService {

    constructor(
        @Inject('AuthLogger') private readonly logger: Logger,
        @Inject('AuthRepository') private readonly authRepository: AuthRepository
    ) { }

    async signup({ email, password, passwordConfirmation }: DTOs.SignupBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
       // TODO
    }
}