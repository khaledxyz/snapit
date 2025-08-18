import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sessionConfig } from './config/session.config';
import * as session from 'express-session';
import * as passport from 'passport';
import { getAppConfig } from './config/app.config';

async function bootstrap() {
  const appConfig = await getAppConfig();
  const app = await NestFactory.create(AppModule, appConfig);
  const configService = app.get(ConfigService);

  const allowedOrigins =
    configService
      .get<string>('ALLOWED_ORIGINS')
      ?.split(',')
      ?.map((origin) => origin.trim())
      ?.filter((origin) => origin.length > 0) || [];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.setGlobalPrefix(configService.get<string>('PREFIX'));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory:
        process.env.NODE_ENV === 'production'
          ? (errors) => new BadRequestException('Bad Request')
          : undefined, // undefined means use default behavior
    }),
  );

  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
