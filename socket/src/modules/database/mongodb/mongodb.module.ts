import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';
import UsersSchema from './schemas/chats.schema';

@Module({
    providers: [
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
    exports: ['DatabaseClient']
})
export class DatabaseModule { }