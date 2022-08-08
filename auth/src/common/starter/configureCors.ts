import { INestApplication } from '@nestjs/common';

const configureCors = (app: INestApplication) => {
  // Cors Settings:
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'Authorization, X-Requested-With, Content-Type, Accept, Observe',
    methods: 'GET,PUT,POST,DELETE,PATCH,UPDATE,OPTIONS',
    credentials: true,
  });
};

export default configureCors;
