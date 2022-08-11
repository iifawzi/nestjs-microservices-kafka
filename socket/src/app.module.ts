import { Module } from '@nestjs/common';
import ChatsModule from './modules/chats/chats.module';
import { ConfigurationModule } from './modules/config/config.module';
import SocketModule from './modules/socket/socket.module';

@Module({
  imports: [ConfigurationModule, ChatsModule, SocketModule],
})
export class AppModule { }
