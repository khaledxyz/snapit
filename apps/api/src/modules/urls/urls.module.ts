import { Module } from "@nestjs/common";

import { CodeGeneratorModule } from "@modules/code-generator/code-generator.module";
import { PasswordModule } from "@modules/password/password.module";

import { UrlsController } from "./urls.controller";
import { UrlsService } from "./urls.service";

@Module({
  imports: [PasswordModule, CodeGeneratorModule],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}
