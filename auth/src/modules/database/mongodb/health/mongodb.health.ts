import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Db } from 'mongodb';
import { RunWithTimeOut } from 'src/common/helpers';

@Injectable()
export default class MongoDBHealthIndicator extends HealthIndicator {
    constructor(@Inject('DatabaseClient') private readonly mongoClient: Db) {
        super();
    }

    async isHealthy(key: string, timeout: number): Promise<HealthIndicatorResult> {
        let isHealthy = true;
        try {
            const mongoDBHealthy = await RunWithTimeOut<Record<string, any>>(this.mongoClient.command({ ping: 1 }), 5000);
            isHealthy = mongoDBHealthy.ok;
        } catch (_) {
            isHealthy = false;
        }

        if (isHealthy) {
            const SuccessResult = this.getStatus(key, isHealthy);
            return SuccessResult;
        }

        throw new HealthCheckError('MongoDB failed', this.getStatus(key, isHealthy, { "message": `timeout of ${timeout}ms exceeded` }));
    }
}