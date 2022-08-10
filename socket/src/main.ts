import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import socketIoAdapter from './modules/socket/adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');

  const bootstrapLogger = new Logger('Bootstrapping');

  app.useWebSocketAdapter(new socketIoAdapter(app, new Logger(socketIoAdapter.name)));
  await app.listen(PORT, '0.0.0.0');
  bootstrapLogger.verbose(`Socket server is up and running on http://localhost:${PORT}`);
}
bootstrap();
