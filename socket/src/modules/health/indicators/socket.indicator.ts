import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { io } from "socket.io-client"
import { delay } from 'src/common/helper/runWithTimeout';

@Injectable()
export default class SocketIOHealthIndicator extends HealthIndicator {
    constructor(
        private configService: ConfigService
    ) {
        super()
    }

    async isHealthy(key: string, timeout: number): Promise<HealthIndicatorResult> {
        let isHealthy = false;
        let shouldWait = true;
        try {
            const SOCKET_PORT = +this.configService.get<number>('socket.port');
            const SOCKET_AUTH_HEADER = this.configService.get<string>('socket.auth');
            const header = `bearer ${SOCKET_AUTH_HEADER}`;
            console.log(header);
            const socket = io(`http://localhost:${SOCKET_PORT}`, {
                transports: ['websocket'],
                query: {
                    'authorization': header,
                },
            });
            socket.emit("healthCheck", {});
            socket.on("healthCheck", () => {
                shouldWait = false;
                isHealthy = true;
            });

        } catch (err) {
            shouldWait = false;
        }

        if (shouldWait) {
            await delay(timeout);
        }

        if (isHealthy) {
            const SuccessResult = this.getStatus(key, isHealthy);
            return SuccessResult;
        }
        throw new HealthCheckError('WebSocket failed', this.getStatus(key, isHealthy, { "message": `timeout of ${timeout}ms exceeded` }));

    }
}