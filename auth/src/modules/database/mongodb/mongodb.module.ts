import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';
import { MongoDBHealthIndicator } from './health';
import UsersSchema from './schemas/users.schema';

@Module({
    providers: [
        MongoDBHealthIndicator,
        {
            provide: 'DatabaseClient',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<Db> => {
                try {
                    const client = await MongoClient.connect(configService.get<string>('mongodbURI'));
                    return client.db(configService.get<string>('dbname'));
                } catch (e) {
                    throw e;
                }
            }
        },
        UsersSchema
    ],
    exports: ['DatabaseClient', MongoDBHealthIndicator]
})
export class DatabaseModule { }