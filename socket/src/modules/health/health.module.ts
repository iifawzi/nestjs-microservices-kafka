import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from '../database/mongodb';
import RedisModule from '../redis/redis.module';
import { HealthController } from './health.controller';
import SocketIOHealthIndicator from './indicators/socket.indicator';

@Module({
  imports: [TerminusModule, DatabaseModule, RedisModule],
  controllers: [HealthController],
  providers: [SocketIOHealthIndicator]
})
export class HealthModule {}