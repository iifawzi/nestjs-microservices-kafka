import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['kafka:19092'],
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
  app.listen();
}
bootstrap();
