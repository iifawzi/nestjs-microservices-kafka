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

@Injectable()
export default class EventsHandlersService {
    constructor(
        @Inject('SocketLogger') private readonly logger: Logger,
        private readonly chatsService: ChatsService,
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
        } else {
            // Refactor this part
            const isCached = false;
            if (!isCached) {
                messagesInformation.messages.forEach((messageInfo: MessageLogI) => {
                    client.emit(eventPayload.name, serializeSocketMessage(messageInfo.message, messageInfo.user, messageInfo.fullName));
                    // todo add the last 10 to cache
                });
            } else {
                // load from the cache
            }
        }


        client.to(eventPayload.name).emit(eventPayload.name, { message: `${client.fullName} Joined the room!`, user: 'system', type: 'welcome' });
    }

    async handleMessage(eventPayload: MessagePayload, client: SocketWithInfo) {
        if (client.joinedRooms.filter(room => room === eventPayload.roomName).length) {
            this.chatsService.addMessage(eventPayload.roomName, eventPayload.message, client.fullName, client.userId);
            // todo: add to cache
            this.socketGateway.SocketServer.to(eventPayload.roomName).emit(eventPayload.roomName, serializeSocketMessage(eventPayload.message, client.userId, client.fullName));
        }
    }

    handleIsTyping(eventPayload: MessagePayload, client: SocketWithInfo) {
        client.to(eventPayload.roomName).emit(`${eventPayload.roomName}-typing`, { message: `${client.fullName} is typing!, user: 'system', type: 'typing'` });
    }
}