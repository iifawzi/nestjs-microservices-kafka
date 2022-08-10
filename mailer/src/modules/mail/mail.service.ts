import { UserCreatedEvent } from "./events/types/userCreated.event";
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from "./constants";

@Injectable()
export default class MailService {
    constructor(
        @Inject('MailLogger') private readonly logger: Logger,
        @InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue,

    ) { }

    public async sendConfirmation(data: UserCreatedEvent): Promise<void> {
        this.logger.log(`sendConfirmation - sendConfirmation service started with ${JSON.stringify(data)}`);
        try {
            await this.mailQueue.add(CONFIRM_REGISTRATION, data);
        } catch (error) {
            this.logger.error(`sendConfirmation - Something wrong happened while queueing a job, sending confirmation to [${data.email}]`);
            throw error;
        }
    }
}