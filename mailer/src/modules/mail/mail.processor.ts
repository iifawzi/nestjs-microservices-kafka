import { Inject, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from './constants';
import { UserCreatedEvent } from './events/types/userCreated.event';

@Processor(MAIL_QUEUE)
@Injectable()
export class MailProcessor {
  constructor(
    @Inject('MailLogger') private readonly logger: Logger,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<UserCreatedEvent>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<UserCreatedEvent>) {
    this.logger.log(`Sending confirm registration email to '${job.data.email}'`);

    try {
      return this.mailerService.sendMail({
        to: job.data.email,
        from: this.configService.get('mailer.fromMail'),
        subject: this.configService.get('mailer.subject'),
        template: './confirmation',
        context: { verificationCode: job.data.verificationCode },
      });
    } catch {
      this.logger.error(`Failed to send confirmation email to '${job.data.email}'`);
    }
  }
}
