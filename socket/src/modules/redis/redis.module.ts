import { Module, CacheModule, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as redisStore from 'cache-manager-redis-store';
import RedisService from "./redis.service";

@Module({
    imports: [
        CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('redis.host'),
                port: +configService.get<string>('redis.port')
            }),
        }),
    ],
    providers: [
        RedisService,
        {
            provide: 'ReddisLogger',
            useFactory: (): Logger => new Logger(RedisModule.name)
        }
    ],
    exports: ['ReddisLogger', CacheModule, RedisService]
})
export default class RedisModule { }