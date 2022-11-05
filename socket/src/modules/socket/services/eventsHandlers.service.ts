/******************************************************* 
This service is only responsible for handling the events emitted from the socket clients
******************************************************/

import { Inject, Injectable, Logger } from "@nestjs/common";
import ChatsService from "src/modules/chats/chats.service";
import { joinRoomPayload } from "../events/join_room";
import { MessagePayload } from "../events/message";
import serializeSocketMessage from "../serializers/message.serializer";
import { SocketGateway } from "../socket.gateway";
import { AllowedEventsForEmit, SocketWithInfo } from "../types";
import { ChatDocumentI, MessageLogI } from "src/modules/chats/types"
import RedisService from "src/modules/redis/redis.service";

@Injectable()
export default class EventsHandlersService {
    constructor(
        @Inject('SocketLogger') private readonly logger: Logger,
        private readonly chatsService: ChatsService,
        private readonly redisService: RedisService,
        private socketGateway: SocketGateway,
    ) { }

    async handleEmittedEvents(event: [string, any], client: SocketWithInfo): Promise<void> {
        const eventName = event[0];
        const eventPayload = event[1];

        switch (eventName) {
            case AllowedEventsForEmit.join_room:
                this.handleJoinRoom(eventPayload, client);
                break;
            case AllowedEventsForEmit.message:
                await this.handleMessage(eventPayload, client);
                break
            case AllowedEventsForEmit.isTyping:
                this.handleIsTyping(eventPayload, client);
                break
            case AllowedEventsForEmit.healthCheck:
                this.handleHealthCheck(client);
                break
            default:
                this.logger.debug(`Unallowed event [${eventName}]-[${JSON.stringify(eventPayload)}]`);
                break;
        }
    }
    /*****************************************************
    * Events Handlers: 
    ******************************************************/

    async handleJoinRoom(eventPayload: joinRoomPayload, client: SocketWithInfo) {
        this.logger.log(`handleJoinRoom started with ${JSON.stringify(eventPayload)}`);
        client.join(eventPayload.name);
        client.joinedRooms.push(eventPayload.name);

        const messagesInformation: ChatDocumentI = await this.chatsService.getRoomInfo(eventPayload.name);
        if (!messagesInformation) {
            this.chatsService.createChat(eventPayload.name)
            return;
        }

        const isCached = await this.redisService.checkIfExist(eventPayload.name);
        if (!isCached) {
            await this.redisService.addChatHistory(eventPayload.name, messagesInformation.messages);
        }

        const messages: any = await this.redisService.getChatHistory(eventPayload.name);

        messages.forEach(async (messageInfo: MessageLogI) => {
            client.emit(eventPayload.name, serializeSocketMessage(messageInfo));
        });

        client.to(eventPayload.name).emit(eventPayload.name, { message: `${client.user} Joined the room!`, user: 'system', type: 'welcome' });
    }

    async handleMessage(eventPayload: MessagePayload, client: SocketWithInfo) {
        if (client.joinedRooms.filter(room => room === eventPayload.roomName).length) {
            const createdAt = new Date();
            const messageData = serializeSocketMessage({ message: eventPayload.message, user: client.user, userId: client.userId, created_at: createdAt });
            this.chatsService.addMessage(eventPayload.roomName, messageData)
            this.redisService.addMessage(eventPayload.roomName, messageData);
            this.socketGateway.SocketServer.to(eventPayload.roomName).emit(eventPayload.roomName, serializeSocketMessage({ message: eventPayload.message, user: client.user, userId: client.userId }));
        }
    }

    handleIsTyping(eventPayload: MessagePayload, client: SocketWithInfo) {
        client.to(eventPayload.roomName).emit(`${eventPayload.roomName}-typing`, { message: `${client.user} is typing!`, user: 'system', type: 'typing' });
    }

    handleHealthCheck(client: SocketWithInfo) {
        client.emit(AllowedEventsForEmit.healthCheck, { message: 'OK' });
        client.disconnect();
    }
}