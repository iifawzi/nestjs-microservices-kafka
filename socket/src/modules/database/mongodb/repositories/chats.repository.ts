import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { ChatsRepository } from 'src/modules/chats/contracts';
import { ChatDocumentI, MessageLogI } from 'src/modules/chats/types';

@Injectable()
export default class ChatsMongoDBRepository implements ChatsRepository {

    constructor(@Inject('DatabaseClient') private readonly mongoClient: Db) { }
    private readonly chatsCollection = this.mongoClient.collection('chats');

    async createChat(roomName: string): Promise<any> {
        await this.chatsCollection.insertOne({ roomName, messages: [] });
    }

    async addMessage(roomName: string, message: string, user: string, userId: string): Promise<any> {
        await this.chatsCollection.updateOne({ roomName }, { $push: { messages: { message, user, userId, created_at: new Date() } } })
        return true;
    }

    async getRoomInfo(roomName: string): Promise<any> {
        const roomInfo = await this.chatsCollection.aggregate([
            { $match: { roomName } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $limit: 10 },
            { "$group": { "_id": "$_id", "messages": { "$push": "$messages" } } }
        ]).toArray();
        return roomInfo[0];
    }
}