/******************************************************* 
This service is only responsible for handling the events emitted from the socket clients
******************************************************/

import { Inject, Injectable, Logger } from "@nestjs/common";
import ChatsService from "src/modules/chats/chats.service";
import { joinRoomPayload } from "../events/join_room";
import { MessagePayload } from "../events/message";
import { SocketGateway } from "../socket.gateway";
import { AllowedEventsForEmit, SocketWithInfo } from "../types";

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
    handleJoinRoom(eventPayload: joinRoomPayload, client: SocketWithInfo) {
        this.logger.log(`handleJoinRoom started with ${JSON.stringify(eventPayload)}`);
        client.join(eventPayload.name);
        client.joinedRooms.push(eventPayload.name);
        this.chatsService.createChat(eventPayload.name)
        client.to(eventPayload.name).emit(eventPayload.name, { message: `${client.fullName} Joined the room!`, user: 'system', type: 'welcome' });
    }

    async handleMessage(eventPayload: MessagePayload, client: SocketWithInfo) {
        if (client.joinedRooms.filter(room => room === eventPayload.roomName).length) {
            // Add message to database: 
            this.chatsService.addMessage(eventPayload.roomName, eventPayload.message, client.fullName, client.userId);
            this.socketGateway.SocketServer.to(eventPayload.roomName).emit(eventPayload.roomName, { message: eventPayload.message, user: client.userId });
        }
    }

    handleIsTyping(eventPayload: MessagePayload, client: SocketWithInfo) {
        client.to(eventPayload.roomName).emit(eventPayload.roomName, { message: `${client.fullName} is typing!, user: 'system', type: 'typing'` });
    }
}