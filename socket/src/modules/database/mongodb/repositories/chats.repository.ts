import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { ChatsRepository } from 'src/modules/chats/contracts';

@Injectable()
export default class ChatsMongoDBRepository implements ChatsRepository {

    constructor(@Inject('DatabaseClient') private readonly mongoClient: Db) { }
    private readonly chatsCollection = this.mongoClient.collection('chats');

    async createChat(roomName: string): Promise<any> {
        await this.chatsCollection.insertOne({ roomName, messages: [] });
    }

    async addMessage(roomName: string, message: string, user: string, userId: string): Promise<any> {
        await this.chatsCollection.updateOne({ roomName }, { $push: { messages: { message, user, userId } } })
        return true;
    }

}