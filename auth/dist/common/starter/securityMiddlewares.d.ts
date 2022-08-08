import { NestExpressApplication } from '@nestjs/platform-express';
declare const securityMiddlewares: (app: NestExpressApplication) => void;
export default securityMiddlewares;
