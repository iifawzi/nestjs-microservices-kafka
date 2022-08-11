import { Inject, Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import SocketService from './socket.service';
import { SocketWithInfo } from './types';


@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() SocketServer: Server;
    constructor(
        @Inject('SocketLogger') private readonly logger: Logger,
        private readonly socketService: SocketService
    ) { }

    afterInit(): void {
        this.logger.log('[afterInit] - The socket gateway has been initialized');
        // Register server Middlware to authenticate the client: 
        this.SocketServer.use(this.socketService.authenticateClient);
        this.logger.log('[afterInit] cycle has been ended');
    }

    async handleConnection(client: SocketWithInfo): Promise<void> {
        this.logger.log(`New Client connected to the socket gateway successfully (${client.id})`);
        /**** Register client middleware to validate the events ****/
        client.use(await this.socketService.validateEvent(client));
    }

    /*****************************************************
    * handleDisconnect: 
    ******************************************************/
    handleDisconnect(client: SocketWithInfo): void {
        this.logger.log(`Client disconnected from the socket gateway: ${JSON.stringify({ userId: client.userId })}`);
        client.joinedRooms.forEach(room => {
            this.SocketServer.to(room).emit(room, `${client.user} Left the room!`);
        })
    }
}