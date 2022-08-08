import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import { UseDynamicResponse } from "src/common/interceptors";
import { DescribeAPI, DocuementErrorResponse, DocuementSuccessResponse } from "src/common/swagger";
import AuthService from "./auth.service";
import * as DTOs from "./dto"

@ApiTags('Auth')
@Controller({ version: '1', path: '/auth' })
export default class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    @DescribeAPI('User registration API')
    @UseDynamicResponse()
    @DocuementSuccessResponse(HttpStatus.CREATED, 'Created Successfully')
    @DocuementErrorResponse(HttpStatus.CONFLICT, 'User with the provided email already exists.', 'CONFLICT')
    @DocuementErrorResponse(HttpStatus.BAD_REQUEST, ['Validation Error 1', 'Validation Error 2'], 'Bad Request')
    async signup(@Body() signupDTO: DTOs.SignupBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
        return await this.authService.signup(signupDTO)
    }
}