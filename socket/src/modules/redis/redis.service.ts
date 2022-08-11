import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { MessageLogI } from "../chats/types";

@Injectable()
export default class RedisService {
    constructor(
        @Inject('ReddisLogger') private readonly logger: Logger,
        @Inject(CACHE_MANAGER) private readonly cacheClient: Cache,
    ) { }



    async checkIfExist(roomName: string): Promise<Boolean> {
        return new Promise((resolve) => {
            this.cacheClient.get(`mes-${roomName}`, (err, data) => {
                // data is null if key doesn't exist
                if (err || data === null) {
                    this.logger.debug(`mes-${roomName} is not found or something wrong happened [${JSON.stringify(err)}]`);
                    resolve(false);
                }
                resolve(true);
            })
        })
    }


    async addChatHistory(roomName: string, messages: MessageLogI[]) {
        return await this.cacheClient.set(`mes-${roomName}`, JSON.stringify(messages));
    }

    async getChatHistory(roomName: string): Promise<MessageLogI[]> {
        return new Promise((resolve) => {
            this.cacheClient.get(`mes-${roomName}`, (err, data: string) => {
                // data is null if key doesn't exist
                if (err || data === null) {
                    this.logger.debug(`[getChatHistory] - mes-${roomName} is not found or something wrong happened [${JSON.stringify(err)}]`);
                    resolve([]);
                }
                resolve(JSON.parse(data));
            })
        })
    }

    async addMessage(roomName: string, message: MessageLogI) {
        const currHistory: MessageLogI[] = await this.getChatHistory(roomName);
        currHistory.pop();
        currHistory.unshift(message);
        await this.addChatHistory(roomName, currHistory);
    }
}