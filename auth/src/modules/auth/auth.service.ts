import { Inject, Logger } from "@nestjs/common";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import respondWith from "src/common/helpers/respondWith";
import * as DTOs from "./dto"

export default class AuthService {

    constructor(
        @Inject('AuthLogger') private readonly logger: Logger
    ) { }

    async signup({ email, password, passwordConfirmation }: DTOs.SignupBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
       // TODO
    }
}