import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { LoggerModule as PinoLoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get("NODE_ENV") === "production" ? "info" : "debug",
          transport:
            config.get("NODE_ENV") !== "production"
              ? {
                  target: "pino-pretty",
                  options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    singleLine: true,
                  },
                }
              : undefined,
          autoLogging: {
            ignore: (req) => req.url === "/health",
          },
          genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
          customProps: () => ({
            service: config.get("APP_NAME"),
            env: config.get("NODE_ENV"),
          }),
        },
      }),
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
