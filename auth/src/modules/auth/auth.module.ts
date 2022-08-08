import { Logger, Module } from "@nestjs/common";
import { DatabaseModule } from "../database/mongodb";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService, {
        provide: 'AuthLogger',
        useFactory: (): Logger => {
            return new Logger(AuthModule.name)
        }
    }],
    exports: ['AuthLogger']
})
export default class AuthModule {

}