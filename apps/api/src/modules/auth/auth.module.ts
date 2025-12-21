import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@infra/database/database.module";
import { DATABASE_CONNECTION } from "@infra/database/database-connection";

import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import * as schema from "./auth.schema";

const SECONDS_IN_MINUTE = 60;
const SESSION_FRESH_AGE_MINUTES = 5;

@Module({
  imports: [
    DatabaseModule,
    BetterAuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        middleware: (req, _res, next) => {
          // Fix for Express 5: The /*path pattern sets req.url=/ and req.baseUrl=full_path
          // better-call concatenates baseUrl+url creating a trailing slash that causes 404
          // This middleware restores req.url to the full path before the handler runs
          // thanks to @Brainisthekey
          req.url = req.originalUrl;
          req.baseUrl = "";
          next();
        },
        auth: betterAuth({
          appName: configService.getOrThrow("APP_NAME"),

          basePath: `${configService.get("APP_PREFIX")}/auth`,

          trustedOrigins:
            configService
              .get<string>("ALLOWED_ORIGINS")
              ?.split(",")
              ?.map((origin) => origin.trim())
              ?.filter((origin) => origin.length > 0) || [],

          database: drizzleAdapter(database, { provider: "pg", schema }),

          user: {
            deleteUser: {
              enabled: true,
            },
          },

          session: {
            freshAge: SECONDS_IN_MINUTE * SESSION_FRESH_AGE_MINUTES,
          },

          socialProviders: {
            github: {
              clientId: configService.getOrThrow("GITHUB_CLIENT_ID"),
              clientSecret: configService.getOrThrow("GITHUB_CLIENT_SECRET"),
            },
          },

          advanced: {
            disableOriginCheck:
              configService.getOrThrow("NODE_ENV") === "development",
          },
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
