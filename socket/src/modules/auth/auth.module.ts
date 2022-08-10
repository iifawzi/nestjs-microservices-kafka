import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'AUTH_SERVICE',
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'auth',
                            brokers: [configService.get<string>('kafka.broker'),],
                            sasl: {
                                username: configService.get<string>('kafka.client.username'),
                                password: configService.get<string>('kafka.client.password'),
                                mechanism: 'plain'
                            }
                        },
                        consumer: {
                            groupId: configService.get<string>('kafka.authConsumer.groupId'),
                        }
                    },
                }),
            },
        ]),
    ],
})
export default class AuthModule { }