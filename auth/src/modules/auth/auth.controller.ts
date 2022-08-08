import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Auth')
@Controller({ version: '1', path: '/auth' })
export default class AuthController {
}