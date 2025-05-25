import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')
    .split(',')
    .map(origin => origin.trim())
    .filter(origin => origin.length > 0);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  app.setGlobalPrefix(configService.get<string>('PREFIX'));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: process.env.NODE_ENV === 'production'
        ? (errors) => new BadRequestException('Bad Request')
        : undefined, // undefined means use default behavior
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
