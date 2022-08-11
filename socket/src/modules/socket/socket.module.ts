import { Logger, Module } from "@nestjs/common";
import ChatsModule from "../chats/chats.module";
import EventsHandlersService from "./services/eventsHandlers.service";
import { SocketGateway } from "./socket.gateway";
import SocketService from "./socket.service";

@Module({
    imports: [ChatsModule],
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