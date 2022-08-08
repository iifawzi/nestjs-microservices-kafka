import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Module({
    providers: [
        {
            provide: 'DatabaseClient',
            useFactory: async (): Promise<Db> => {
                try {
                    const client = await MongoClient.connect('mongodb://127.0.0.1');
                    return client.db('mydb');
                } catch (e) {
                    throw e;
                }
            }
        },
    ],
    exports: ['DatabaseClient']
})
export class DatabaseModule { }