import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import socketIoAdapter from './modules/socket/adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');
  const SOCKET_PORT = +configService.get<number>('socket.port');

  const bootstrapLogger = new Logger('Bootstrapping');

  app.useWebSocketAdapter(new socketIoAdapter(app, new Logger(socketIoAdapter.name), configService));
  await app.listen(PORT, '0.0.0.0');
  bootstrapLogger.verbose(`Server is running on http://localhost:${PORT} and Socket is up on ws://localhost:${SOCKET_PORT}`);
}
bootstrap();
