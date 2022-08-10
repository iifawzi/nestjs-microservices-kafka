import { Module } from '@nestjs/common';
import { ConfigurationModule } from './modules/config/config.module';
import MailModule from './modules/mail/mail.module';
import QueueModule from './modules/queue/queue.module';

@Module({
  imports: [ConfigurationModule, MailModule, QueueModule],
})
export class AppModule { }
