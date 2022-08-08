import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configsSchema, configurations } from 'src/configs';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      validationSchema: configsSchema,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigurationModule {}
