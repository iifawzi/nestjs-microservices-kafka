import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/mongodb";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export default class AuthModule {

}