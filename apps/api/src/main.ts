import {
  BadRequestException,
  RequestMethod,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import helmet from "helmet";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";

import { AppModule } from "./app.module";

async function bootstrap() {
  // 1. Application initialization
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  // 2. Security middleware
  app.use(helmet({ noSniff: false }));

  // 3. CORS configuration
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

  // 4. Global configuration
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
          : undefined,
    })
  );

  // 5. Logging
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // 6. API documentation
  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const openapiPath = resolve(__dirname, "../../openapi.json");
  writeFileSync(openapiPath, JSON.stringify(document, null, 2));

  // 7. Start server
  await app.listen(configService.getOrThrow("APP_PORT"));
}
bootstrap();
