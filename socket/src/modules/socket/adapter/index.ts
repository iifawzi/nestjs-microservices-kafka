import { IoAdapter } from "@nestjs/platform-socket.io";
import { Socket } from 'socket.io';
import { INestApplication, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken'

// This would help us authenticating the clients before even connecting to the socket gateway.
export class socketIoAdapter extends IoAdapter {
    constructor(
        app: INestApplication,
        private readonly logger: Logger,
        private configService: ConfigService,
    ) {
        super();
    }

    createIOServer(port: number, options?: any): any {
        port = this.configService.get<number>('socket.port');
        const secretKey = this.configService.get<string>('usersAuth.secret');
        const server = super.createIOServer(port, options);
        server.use((socket: Socket, next: (error?: Error) => void) => {
            this.logger.verbose(`[createIOServer] - Socket auth middleware started`);
            const authHeader = socket.handshake.headers.authorization;
            // To get the token without bearer
            const authorizationToken = authHeader.split('bearer ')[1];
            try {
                const isValidToken = jwt.verify(authorizationToken, secretKey);
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