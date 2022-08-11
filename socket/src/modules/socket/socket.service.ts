import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { SocketWithInfo } from "./types";
import * as jwt from 'jsonwebtoken'
import { isEmitEventAllowed } from "./utils";
import { EventsHandlersService } from "./services";
import ChatsService from "../chats/chats.service";

@Injectable()
export default class SocketService {
    constructor(
        @Inject('SocketLogger') private readonly logger: Logger,
        @Inject(forwardRef(()=> EventsHandlersService)) private readonly eventsHandlersService: EventsHandlersService,
        private readonly chatsService: ChatsService,
    ) { }

    /*****************************************************
    * authenticateClient: 
    * Written as arrow function since it will be passed as an middleware. 
    ******************************************************/
    authenticateClient = async (client: SocketWithInfo, next: (error?: Error) => void): Promise<void> => {
        try {
            this.logger.log(`Client is connecting to the socket gateway ${client.id}`);
            const AuthorizationToken = client.handshake.headers.authorization.split('bearer ')[1];
            const userData: any = jwt.decode(AuthorizationToken)
            if (!userData) {
                this.logger.debug(`Something wrong happened while verifiying the identity of the Client: ${client.id}: ${userData}`);
                return next(new WsException('You\'re not authorized, we\'re not able to identify your identity'));
            } else {
                client.userId = userData.userId;
                client.user = userData.fullName;
                client.joinedRooms = [];
                this.logger.debug(`Client (${client.id}): identity was successfully identified. userId: (${client.userId})`);
                return next();
            }
        } catch (error) {
            this.logger.debug(`something wrong happend while authenticateClient ${error}`);
            return next(new WsException('Sorry, you\'re not authorized, we\'re not able to identify your identity'));
        } finally {
            this.logger.verbose('authenticateClient is finished');
        }
    }

    /*****************************************************
    * validateEvent: 
    * Written as arrow function since it will be passed as an middleware. 
    * A security middleware in order to prevent any misuse of the socket server. 
    ******************************************************/
    validateEvent = async (client: SocketWithInfo): Promise<any> => {
        return async (event: [string, any], next: (error?: Error) => void) => {
            try {
                const { status, reason } = isEmitEventAllowed(event);
                if (!status) {
                    this.logger.debug(reason);
                    return client.disconnect(true);
                }
                await this.eventsHandlersService.handleEmittedEvents(event, client);
                return next();
            } catch (error) {
                this.logger.debug(`something wrong happend while validating the event ${error}`);
                return client.disconnect(true);
            }
        }
    }
}