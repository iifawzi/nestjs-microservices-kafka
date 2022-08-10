import { Module } from '@nestjs/common';
import { ConfigurationModule } from './modules/config/config.module';

@Module({
  imports: [ConfigurationModule],
})
export class AppModule { }
