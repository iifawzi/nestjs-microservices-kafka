import { Body, Controller, HttpStatus, Inject, Patch, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmptyResponseDTO, SuccessResponseDTO } from "src/common/dto";
import { UseDynamicResponse } from "src/common/interceptors";
import { RequestWithUser } from "src/common/interfaces";
import { DescribeAPI, DocuementErrorResponse, DocuementSuccessResponse } from "src/common/swagger";
import AuthService from "./auth.service";
import * as DTOs from "./dto"
import { useLocalAuth } from "./passport/guards";

@ApiTags('Auth')
@Controller({ version: '1', path: '/auth' })
export default class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @DescribeAPI('User registration API')
    @DocuementSuccessResponse(HttpStatus.CREATED, 'Created Successfully')
    @DocuementErrorResponse(HttpStatus.CONFLICT, 'User with the provided email already exists.', 'CONFLICT')
    @DocuementErrorResponse(HttpStatus.BAD_REQUEST, ['Validation Error 1', 'Validation Error 2'], 'Bad Request')
    @UseDynamicResponse()
    @Post('signup')
    async signup(@Body() signupDTO: DTOs.SignupBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
        return await this.authService.signup(signupDTO)
    }

    @DescribeAPI('User Login API')
    @DocuementSuccessResponse(HttpStatus.OK, 'Successfull login', DTOs.SigninResponse)
    @DocuementErrorResponse(HttpStatus.BAD_REQUEST, ['Validation Error 1', 'Validation Error 2'], 'Bad Request')
    @UseDynamicResponse()
    @useLocalAuth()
    @Post('signin')
    async signin(@Body() signinDTO: DTOs.SigninBody, @Req() { user }: RequestWithUser): Promise<SuccessResponseDTO<DTOs.SigninResponse>> {
        return await this.authService.signin(user);
    }

    @DescribeAPI('Verify email API')
    @DocuementSuccessResponse(HttpStatus.OK, 'Email have been verified successfully', DTOs.SigninResponse)
    @DocuementErrorResponse(HttpStatus.BAD_REQUEST, ['Validation Error 1', 'Validation Error 2'], 'Bad Request')
    @DocuementErrorResponse(HttpStatus.FORBIDDEN, 'Token is not valid', 'FORBIDDEN')
    @DocuementErrorResponse(HttpStatus.UNAUTHORIZED, 'You\'re not authorized to perform this action', 'UNAUTHORIZED')
    @DocuementErrorResponse(HttpStatus.CONFLICT, 'Email is already verified', 'CONFLICT')
    @UseDynamicResponse()
    @Patch('verifyEmail')
    async verifyEmail(@Body() verifyDTO: DTOs.VerifyBody): Promise<SuccessResponseDTO<EmptyResponseDTO>> {
        return await this.authService.verifyEmail(verifyDTO);
    }
}