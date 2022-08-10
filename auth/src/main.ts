import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureCors, configureSwagger, securityMiddlewares, setGlobalInterceptors, setGlobalPipes } from './common/starter';
import configureVersioning from './common/starter/configureVersioning';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');
  const GLOBAL_PREFIX = configService.get<string>('API_GLOBAL_PREFIX');
  const KAFKA_USERNAME = configService.get<string>('kafka.client.username');
  const KAFKA_PASSWORD = configService.get<string>('kafka.client.password');
  const KAFKA_AUTHCONSUMER_GROUPID = configService.get<string>('kafka.client.authConsumer.groupId');
  const KAFKA_BROKER = configService.get<string>('kafka.broker');

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_BROKER],
        sasl: {
          username: KAFKA_USERNAME,
          password: KAFKA_PASSWORD,
          mechanism: 'plain'
        }
      },
      consumer: {
        groupId: KAFKA_AUTHCONSUMER_GROUPID
      }
    }
  });

  // Configurations
  const bootstrapLogger = new Logger('Bootstrapping');
  securityMiddlewares(app)
  app.setGlobalPrefix(GLOBAL_PREFIX);
  configureVersioning(app);
  configureCors(app);
  setGlobalInterceptors(app);
  setGlobalPipes(app);
  configureSwagger(app);

  await app.startAllMicroservices();
  await app.listen(PORT, '0.0.0.0');
  bootstrapLogger.verbose(`Application is up and running on http://localhost:${PORT}`);
}
bootstrap();
