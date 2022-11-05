import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'src/modules/config/config.module';
import AuthModule from 'src/modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigurationModule,
    AuthModule,
    HealthModule
  ],
})
export class AppModule {}
