import { Logger, Module } from "@nestjs/common";
import { DatabaseModule } from "../database/mongodb";
import ChatsMongoDBRepository from "../database/mongodb/repositories/chats.repository";
import ChatsService from "./chats.service";

@Module({
    imports: [DatabaseModule],
    providers: [
        ChatsService,
        {
            provide: 'chatsRepository',
            useClass: ChatsMongoDBRepository
        },
        {
            provide: 'ChatsLogger',
            useFactory: (): Logger => new Logger(ChatsModule.name)
        },
    ],
    exports: ['ChatsLogger', 'chatsRepository', ChatsService]
})
export default class ChatsModule { }