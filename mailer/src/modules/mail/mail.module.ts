import { Logger, Module } from "@nestjs/common";
import MailController from "./mail.controller";
import MailService from "./mail.service";
import { BullModule } from '@nestjs/bull';
import { MAIL_QUEUE } from "./constants";
import { MailProcessor } from "./mail.processor";
import MailingModule from "../mailing/mailing.module";
import { QueueHealthIndicator } from "./health";

@Module({
    imports: [
        MailingModule,
        BullModule.registerQueue({
            name: MAIL_QUEUE,
        }),
    ],
    controllers: [MailController],
    providers: [
        QueueHealthIndicator,
        MailService,
        MailProcessor,
        {
            provide: 'MailLogger',
            useFactory: (): Logger => new Logger(MailModule.name)
        },
    ],
    exports: [QueueHealthIndicator]
})
export default class MailModule { }