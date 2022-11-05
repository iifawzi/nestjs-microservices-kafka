import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Queue } from 'bull';
import { RunWithTimeOut } from 'src/common/helper';
import { MAIL_QUEUE } from 'src/modules/mail/constants';

@Injectable()
export default class QueueHealthIndicator extends HealthIndicator {
    constructor(
        @InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue,
    ) {
        super()
    }

    async isHealthy(key: string, timeout: number): Promise<HealthIndicatorResult> {
        let isHealthy = true;
        try {
            const isAlive = await RunWithTimeOut<string>(this.mailQueue.client.ping(), timeout);
            isHealthy = isAlive === 'PONG';
        } catch (_) {
            isHealthy = false;
        }

        if (isHealthy) {
            const counts = await this.mailQueue.getJobCounts();
            const SuccessResult = this.getStatus(key, isHealthy, { [MAIL_QUEUE]: counts });
            return SuccessResult;
        }

        throw new HealthCheckError('Queue failed', this.getStatus(key, isHealthy, { "message": `timeout of ${timeout}ms exceeded` }));
    }
}