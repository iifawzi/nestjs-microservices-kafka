import { Inject, Injectable, Logger } from "@nestjs/common";
import { ChatsRepository } from "./contracts";
import { MessageLogI } from "./types";

@Injectable()
export default class ChatsService {
    constructor(
        @Inject('ChatsLogger') private readonly logger: Logger,
        @Inject('chatsRepository') private readonly chatsRepository: ChatsRepository,
    ) { }

    async createChat(roomName: string): Promise<any> {
        return await this.chatsRepository.createChat(roomName);
    }

    async addMessage(roomName: string, messageInfo: MessageLogI): Promise<any> {
        return await this.chatsRepository.addMessage(roomName, messageInfo);
    }

    async getRoomInfo(roomName: string): Promise<any> {
        return await this.chatsRepository.getRoomInfo(roomName);
    }
}