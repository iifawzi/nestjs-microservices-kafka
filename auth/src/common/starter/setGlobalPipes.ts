import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

const setGlobalPipes = (app: INestApplication) => {
  return app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      whitelist: true,
      forbidNonWhitelisted: true
    }),
  );
};

export default setGlobalPipes;
