import { Logger, Module } from "@nestjs/common";
import { BcryptHelpers } from "src/common/utilities";
import { DatabaseModule } from "../database/mongodb";
import AuthMongoDBRepository from "../database/mongodb/repositories/auth.repository";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { LocalStrategy } from "./passport/strategies";
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        DatabaseModule,
        ClientsModule.register([
            {
                name: 'MAIL_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'auth',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'mail-consumer'
                    }
                }
            }
        ]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: {
                    expiresIn: `${configService.get<string>('jwt.expire')}`,
                },
            }),
        }),],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        {
            provide: 'AuthLogger',
            useFactory: (): Logger => new Logger(AuthModule.name)
        },
        {
            provide: 'AuthRepository',
            useClass: AuthMongoDBRepository
        },
        {
            provide: 'bcryptHelpers',
            useClass: BcryptHelpers
        },
    ],
    exports: ['AuthLogger', 'AuthRepository', 'bcryptHelpers']
})
export default class AuthModule {

}