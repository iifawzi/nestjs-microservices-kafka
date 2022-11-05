import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { HealthCheckService, HealthCheck, MemoryHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { QueueHealthIndicator } from '../mail/health';

@Controller('health')
export class HealthController {
    constructor(
        private configService: ConfigService,
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
        private microservice: MicroserviceHealthIndicator,
        private QueueHealthIndicator: QueueHealthIndicator
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('mermory_rss', 3000 * 1024 * 1024),
            // KAFKA HEALTHY
            () => this.microservice.pingCheck('kafka', {
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'auth',
                        brokers: [this.configService.get<string>('kafka.broker')],
                        sasl: {
                            username: this.configService.get<string>('kafka.client.username'),
                            password: this.configService.get<string>('kafka.client.password'),
                            mechanism: 'plain'
                        }
                    }
                },
                timeout: 10000
            }),
            // Queue HEALTHY
            () => this.QueueHealthIndicator.isHealthy('Queue', 5000)
        ]);
    }
}