import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

const configureSwagger = (app: INestApplication): void => {
  const configService = app.get(ConfigService);
  const swaggerDocsPath = configService.get<string>('SWAGGER_DOCS_PATH');

  // The main swagger docs options:
  const options = new DocumentBuilder()
    .setTitle('LINKDEV - Microservices')
    .setDescription('API Documintation for Authentication service')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.use(swaggerDocsPath, basicAuth({ challenge: true, users: { xiotapidocsadmin: 'xiotapiadmindocs' } }));
  SwaggerModule.setup(swaggerDocsPath, app, document);
};

export default configureSwagger;
