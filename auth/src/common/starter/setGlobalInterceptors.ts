import { INestApplication } from '@nestjs/common';
import { LoggingInterceptor } from 'src/common/interceptors';

const setGlobalInterceptors = (app: INestApplication) => {
  return app.useGlobalInterceptors(
    new LoggingInterceptor(),
  );
};

export default setGlobalInterceptors;