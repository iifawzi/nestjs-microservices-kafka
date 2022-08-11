import { Db } from 'mongodb';

import { Inject } from "@nestjs/common";

export default class ChatsSchema {
    constructor(
        @Inject('DatabaseClient') private readonly databaseClient: Db
    ) {
        this.create();
    }

    private async create() {
        let isCollectionExists = true;
        await this.databaseClient.listCollections().toArray((_, collections) => {
            isCollectionExists = collections.some(coll => coll.name == 'chats')
        });

        if (!isCollectionExists) {
            this.databaseClient.createCollection('chats', {
                validator: {
                    $jsonSchema: {
                        bsonType: ["array"],
                        additionalProperties: false,
                        items: {
                            bsonType: ["object"],
                            required: ["roomName", "message"],
                            additionalProperties: false,
                            properties: {
                                roomName: {
                                    bsonType: "string",
                                    description: "'roomName' is required"
                                },
                                messages: {
                                    bsonType: ["array"],
                                    description: "'messages' are a required",
                                    items: {
                                        bsonType: ["object"],
                                        properties: {
                                            message: {
                                                bsonType: "string",
                                            },
                                            user: {
                                                bsonType: "string",
                                            },
                                        }
                                    }
                                }
                            }
                        },
                    }
                },
            });

            this.databaseClient.collection('users').createIndex({ email: 1 }, { unique: true })
        }
    }
}