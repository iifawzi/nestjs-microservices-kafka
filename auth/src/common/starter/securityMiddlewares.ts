import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
const securityMiddlewares = (app: NestExpressApplication) => {
  app.use(helmet());
};

export default securityMiddlewares;
