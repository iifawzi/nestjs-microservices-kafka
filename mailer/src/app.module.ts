import { Module } from '@nestjs/common';
import { ConfigurationModule } from './modules/config/config.module';
import MailModule from './modules/mail/mail.module';

@Module({
  imports: [MailModule, ConfigurationModule],
})
export class AppModule { }
