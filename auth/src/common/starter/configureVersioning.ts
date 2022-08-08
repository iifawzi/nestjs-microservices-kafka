import { INestApplication, VersioningType } from '@nestjs/common';

const configureVersioning = (app: INestApplication) => {
  app.enableVersioning({ type: VersioningType.URI });
};

export default configureVersioning;
