import { Db } from 'mongodb';

import { Inject } from "@nestjs/common";

export default class UsersSchema {
    constructor(
        @Inject('DatabaseClient') private readonly databaseClient: Db
    ) {
        this.create();
    }


    private async create() {
        let isCollectionExists = true;
        await this.databaseClient.listCollections().toArray((_, collections) => {
            isCollectionExists = collections.some(coll => coll.name == 'users')
        });

        if (!isCollectionExists) {
            this.databaseClient.createCollection('users', {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["email", "password", "isVerified", "verificationCode"],
                        additionalProperties: false,
                        properties: {
                            email: {
                                bsonType: "string",
                                description: "email must be a string and is required"
                            },
                            password: {
                                bsonType: "string",
                                description: "password must be a string and is required"
                            },
                            isVerified: {
                                bsonType: "string",
                                description: "isVerified must be a boolean and is required"
                            },
                            verificationCode: {
                                bsonType: "string",
                                description: "verificationCode must be a string and is required"
                            },
                        }
                    }
                },
            });

            this.databaseClient.collection('users').createIndex({ email: 1 }, { unique: true })
        }
    }
}