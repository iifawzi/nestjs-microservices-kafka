import { IoAdapter } from "@nestjs/platform-socket.io";
import { Socket } from 'socket.io';
import { INestApplication, Inject, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { ClientKafka } from "@nestjs/microservices";

// This would help us authenticating the clients before even connecting to the socket gateway.
export class socketIoAdapter extends IoAdapter {
    private readonly authService: ClientKafka;
    constructor(
        app: INestApplication,
        private readonly logger: Logger,
    ) {
        super();
        this.authService = app.get('AUTH_SERVICE');
    }
    
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.use((socket: Socket, next: (error?: Error) => void) => {
            this.logger.verbose(`[createIOServer] - Socket auth middleware started`);
            const authHeader = socket.handshake.headers.authorization;
            // To get the token without bearer
            const authorizationToken = authHeader.split('bearer ')[1];
            try {
                // TODO:: VERIFY USING KAFKA BY COMMUNICATING WITH AUTH. 
                const isValidToken = true
                if (isValidToken) {
                    return next();
                }
                this.logger.debug(`[createIOServer] - Client is not authoirzed, token is invalid`);
                return next(new WsException('You\'re not authorized'));
            } catch (error) {
                this.logger.debug(`[createIOServer] - Client is not authoirzed, something wrong happened ${JSON.stringify(error)}`);
                return next(new WsException('You\'re not authorized'));
            }
        })
        return server;
    }
}

export default socketIoAdapter