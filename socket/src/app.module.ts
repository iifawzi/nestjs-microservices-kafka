import { Module } from '@nestjs/common';
import AuthModule from './modules/auth/auth.module';
import { ConfigurationModule } from './modules/config/config.module';
import SocketModule from './modules/socket/socket.module';

@Module({
  imports: [ConfigurationModule, AuthModule, SocketModule],
})
export class AppModule { }
