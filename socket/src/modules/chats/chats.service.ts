import { Inject, Injectable, Logger } from "@nestjs/common";
import { ChatsRepository } from "./contracts";

@Injectable()
export default class ChatsService {
    constructor(
        @Inject('ChatsLogger') private readonly logger: Logger,
        @Inject('chatsRepository') private readonly chatsRepository: ChatsRepository,
    ) { }

    async createChat(roomName: string): Promise<any> {
        return await this.chatsRepository.createChat(roomName);
    }

    async addMessage(roomName: string, message: string, userName, userId: string): Promise<any> {
        return await this.chatsRepository.addMessage(roomName, message, userName, userId);
    }
}