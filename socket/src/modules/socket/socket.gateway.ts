import { Inject, Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway()
export class SocketGateway implements OnGatewayInit {

    @WebSocketServer() SocketServer: Server;

    constructor(
        @Inject('SocketLogger') private readonly logger: Logger
    ) { }

    /*****************************************************
    * afterInit: 
    ******************************************************/
    afterInit(): void {
        this.logger.log('[Socket Gateway] - The socket gateway has been initialized');
    }
}