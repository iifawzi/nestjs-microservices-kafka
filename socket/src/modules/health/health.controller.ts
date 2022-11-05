import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckService, HealthCheck, MemoryHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { MongoDBHealthIndicator } from '../database/mongodb/health';
import { Transport } from '@nestjs/microservices';
import SocketIOHealthIndicator from './indicators/socket.indicator';

@Controller('health')
export class HealthController {
    constructor(
        private configService: ConfigService,
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
        private microservice: MicroserviceHealthIndicator,
        private mongoDBHealthIndicator: MongoDBHealthIndicator,
        private socketIOHealthIndicator: SocketIOHealthIndicator
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('mermory_rss', 3000 * 1024 * 1024),
            // MongoDB HEALTHY
            () => this.mongoDBHealthIndicator.isHealthy('MongoDB', 5000),
            // REDIS HEALTHY (Although we're not using it as a microservice, but we can test the connectivity this way.)
            () => this.microservice.pingCheck('REDIS', {
                transport: Transport.REDIS,
                options: {
                    host: this.configService.get<string>('redis.host'),
                    port: +this.configService.get<string>('redis.port')
                },
                timeout: 5000
            }),
            // SocketIO
            () => this.socketIOHealthIndicator.isHealthy('SocketIO', 5000)
        ]);
    }
}