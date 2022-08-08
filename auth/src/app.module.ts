import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/modules/config/config.module';
import AuthModule from 'src/modules/auth/auth.module';

@Module({
  imports: [
    ConfigurationModule,
    AuthModule
  ],
})
export class AppModule {}
