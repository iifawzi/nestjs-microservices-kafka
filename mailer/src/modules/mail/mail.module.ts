import { Logger, Module } from "@nestjs/common";
import MailController from "./mail.controller";
import MailService from "./mail.service";
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from "./constants";

@Module({
    controllers: [MailController],
    providers: [MailService,
        {
            provide: 'MailLogger',
            useFactory: (): Logger => new Logger(MailModule.name)
        },
    ],
    imports: [
        BullModule.registerQueue({
            name: MAIL_QUEUE,
        }),
    ]
})
export default class MailModule { }