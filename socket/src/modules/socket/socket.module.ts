import { Logger, Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";

@Module({
    imports: [],
    providers: [
        {
            provide: 'SocketLogger',
            useFactory: (): Logger => new Logger(SocketModule.name)
        },
        SocketGateway,
    ],
    exports: ['SocketLogger']
})
export default class SocketModule { }