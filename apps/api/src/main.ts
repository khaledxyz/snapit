import {
  BadRequestException,
  RequestMethod,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import helmet from "helmet";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.use(helmet({ noSniff: false }));

  const allowedOrigins =
    configService
      .get<string>("ALLOWED_ORIGINS")
      ?.split(",")
      ?.map((origin) => origin.trim())
      ?.filter((origin) => origin.length > 0) || [];

  app.enableCors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  app.setGlobalPrefix(configService.get<string>("APP_PREFIX"), {
    exclude: [{ path: "/", method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory:
        configService.getOrThrow("NODE_ENV") === "production"
          ? (_errors) => new BadRequestException("Bad Request")
          : undefined, // undefined means use default behavior
    })
  );

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(configService.getOrThrow("APP_PORT"));
}
bootstrap();
