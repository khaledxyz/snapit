import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as BaseMailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule,
    BaseMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST'),
          port: configService.getOrThrow<number>('SMTP_PORT'),
          secure: configService.getOrThrow<boolean>('SMTP_SECURE'),
          auth: {
            user: configService.getOrThrow<string>('SMTP_USER'),
            pass: configService.getOrThrow<string>('SMTP_PASSWORD'),
          },
          debug: Boolean(configService.get<string>('SMTP_DEBUG')),
          logger: Boolean(configService.get<string>('SMTP_DEBUG')),
        },
      }),
    }),
  ],
  exports: [BaseMailerModule],
})
export class MailerModule {}
