import { Module } from '@nestjs/common';
import { ConfigurationModule } from './modules/config/config.module';
import SocketModule from './modules/socket/socket.module';

@Module({
  imports: [ConfigurationModule, SocketModule],
})
export class AppModule { }
