import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import MailModule from '../mail/mail.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, MailModule],
  controllers: [HealthController],
  providers: []
})
export class HealthModule {}