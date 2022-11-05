import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');
  const bootstrapLogger = new Logger('Bootstrapping');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER],
          sasl: {
            username: process.env.KAFKA_CLIENT_USERNAME,
            password: process.env.KAFKA_CLIENT_PASSWORD,
            mechanism: 'plain'
          }
        },
        consumer: {
          groupId: process.env.KAFKA_MAILCONSUMER_GROUPID
        }
      }
    }
  );

  await app.startAllMicroservices();
  await app.listen(PORT, '0.0.0.0');
  bootstrapLogger.verbose(`Mailer service is up and running on http://localhost:${PORT}`);
}
bootstrap();
