import { Logger, Module } from "@nestjs/common";
import { DatabaseModule } from "../database/mongodb";
import AuthMongoDBRepository from "../database/mongodb/repositories/auth.repository";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService, {
        provide: 'AuthLogger',
        useFactory: (): Logger => new Logger(AuthModule.name)
    },
    {

        provide: 'AuthRepository',
        useClass: AuthMongoDBRepository
    }

],
    exports: ['AuthLogger', 'AuthRepository']
})
export default class AuthModule {

}