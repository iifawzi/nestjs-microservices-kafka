import { Module } from "@nestjs/common";
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('mailer.host'),
                    port: +configService.get('mailer.port'),
                    secure: true,
                    auth: {
                        user: configService.get('mailer.auth.user'),
                        pass: configService.get('mailer.auth.pass'),
                    },
                    tls: { rejectUnauthorized: false },
                },
                template: {
                    dir: __dirname + '/templates',
                    adapter: new HandlebarsAdapter(),
                    options: { strict: true },
                },
            }),
        }),
    ],
    exports: [MailerModule]
})
export default class MailingModule { }