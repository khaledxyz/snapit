import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

import { DatabaseModule } from "@infra/database/database.module";
import { HealthModule } from "@infra/health/health.module";
import { LoggerModule } from "@infra/logger/logger.module";
import { MetricsModule } from "@infra/metrics/metrics.module";
import { RateLimiterModule } from "@infra/rate-limiter/rate-limiter.module";

import { AuthModule } from "@modules/auth/auth.module";
import { UrlsModule } from "@modules/urls/urls.module";

@Module({
  imports: [
    // INFRA
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    MetricsModule,
    LoggerModule,
    RateLimiterModule,

    // MODULES
    AuthModule,
    UrlsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
