import { Module } from "@nestjs/common";

import { PrometheusModule } from "@willsoto/nestjs-prometheus";

@Module({
  imports: [PrometheusModule.register()],
  controllers: [],
})
export class MetricsModule {}
