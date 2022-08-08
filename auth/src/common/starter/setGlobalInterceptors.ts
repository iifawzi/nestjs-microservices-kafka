import { INestApplication, Logger } from '@nestjs/common';
import { LoggingInterceptor } from 'src/common/interceptors';

const setGlobalInterceptors = (app: INestApplication) => {
  return app.useGlobalInterceptors(
    new LoggingInterceptor( new Logger('HTTP')),
  );
};

export default setGlobalInterceptors;