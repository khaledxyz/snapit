import { Controller, Get } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

import { OptionalAuth } from "@thallesp/nestjs-better-auth";

@OptionalAuth()
@Controller("health")
@ApiExcludeController()
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get("/")
  @HealthCheck()
  checkLiveness() {
    return this.health.check([]);
  }
}
