import { Module } from "@nestjs/common";
import { BullModule } from '@nestjs/bull';
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    redis: {
                        host: configService.get<string>('redis.host'),
                        port: +configService.get<string>('redis.port'),
                    },
                }
            }
        }),
    ],
    exports: [BullModule]
})
export default class QueueModule { }