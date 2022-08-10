import { Inject, Logger } from '@nestjs/common';
import { OnGatewayInit, OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import SocketService from './socket.service';
import { SocketWithId } from './types';


@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection {
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

    async handleConnection(client: SocketWithId): Promise<void> {
        this.logger.verbose(`handleConnection has started: ${client.id}`);
        this.logger.log(`New Client connected to the socket gateway successfully (${client.id})`);
        this.logger.verbose(`handleConnection has ended: ${client.id}`);
        /**** Register client middleware to validate the events ****/
        client.use(await this.socketService.validateEvent(client));
    }
}