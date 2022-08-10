import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import socketIoAdapter from './modules/socket/adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new socketIoAdapter(app,  new Logger(socketIoAdapter.name)));
  await app.listen(3001);
}
bootstrap();
