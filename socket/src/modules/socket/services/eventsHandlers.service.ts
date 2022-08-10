/******************************************************* 
This service is only responsible for handling the events emitted from the socket clients
******************************************************/

import { Inject, Injectable, Logger } from "@nestjs/common";
import { AllowedEventsForEmit, SocketWithId } from "../types";

@Injectable()
export default class EventsHandlersService {
    constructor(
        @Inject('SocketLogger') private readonly logger: Logger,
    ) { }

    /*****************************************************
    * handleEmittedEvents: 
    ******************************************************/
    async handleEmittedEvents(event: [string, any], client: SocketWithId): Promise<void> {
        this.logger.verbose(`handleEmittedEvents started ${JSON.stringify(event)}`);
        const eventName = event[0];
        const eventPayload = event[1];

        switch (eventName) {
            case AllowedEventsForEmit.join_room:
                // todo
                break;
            default:
                this.logger.debug(`Unallowed event [${eventName}]-[${JSON.stringify(eventPayload)}]`);
                break;
        }
        this.logger.verbose('handleEmittedEvents is finished');
    }
}