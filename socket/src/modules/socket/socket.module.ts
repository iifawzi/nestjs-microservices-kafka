import { Logger, Module } from "@nestjs/common";
import EventsHandlersService from "./services/eventsHandlers.service";
import { SocketGateway } from "./socket.gateway";
import SocketService from "./socket.service";

@Module({
    imports: [],
    providers: [
        {
            provide: 'SocketLogger',
            useFactory: (): Logger => new Logger(SocketModule.name)
        },
        SocketGateway,
        SocketService,
        EventsHandlersService
    ],
    exports: ['SocketLogger']
})
export default class SocketModule { }