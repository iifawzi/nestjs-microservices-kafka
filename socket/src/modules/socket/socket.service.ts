import { Inject, Injectable, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { SocketWithId } from "./types";
import * as jwt from 'jsonwebtoken'
import { isEmitEventAllowed } from "./utils";
import { EventsHandlersService } from "./services";

@Injectable()
export default class SocketService {
    constructor(
        @Inject('SocketLogger') private readonly logger: Logger,
        private readonly eventsHandlersService: EventsHandlersService,
    ) { }

    /*****************************************************
    * authenticateClient: 
    * Written as arrow function since it will be passed as an middleware. 
    ******************************************************/
    authenticateClient = async (client: SocketWithId, next: (error?: Error) => void): Promise<void> => {
        try {
            this.logger.log(`Client is connecting to the socket gateway ${client.id}`);
            const AuthorizationToken = client.handshake.headers.authorization.split('bearer ')[1];
            const userData: any = jwt.decode(AuthorizationToken)
            if (!userData) {
                this.logger.debug(`Something wrong happened while verifiying the identity of the Client: ${client.id}: ${userData}`);
                return next(new WsException('You\'re not authorized, we\'re not able to identify your identity'));
            } else {
                client.userId = userData.userId;
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
         validateEvent = async (client: SocketWithId): Promise<any> => {
            return async (event: [string, any], next: (error?: Error) => void) => {
                try {
                    this.logger.verbose(`Event validation middleware has been started ${JSON.stringify(event)}`);
                    const { status, reason } = isEmitEventAllowed(event);
                    if (!status) {
                        this.logger.debug(reason);
                        return client.disconnect(true);
                    }
                    this.logger.log(`Event successfully identified ${JSON.stringify(event)}`);
                    await this.eventsHandlersService.handleEmittedEvents(event, client);
                    return next();
                } catch (error) {
                    this.logger.debug(`something wrong happend while validating the event ${error}`);
                    return client.disconnect(true);
                } finally {
                    this.logger.verbose('validateEvent is finished');
                }
            }
        }
}