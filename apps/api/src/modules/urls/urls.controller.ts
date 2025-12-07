import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from "@nestjs/common";

import {
  OptionalAuth,
  Session,
  UserSession,
} from "@thallesp/nestjs-better-auth";

import { CreateUrlDto } from "./dto/create-url.dto";
import { UrlDto } from "./dto/url.dto";
import { UrlsService } from "./urls.service";

@Controller("urls")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UrlDto })
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  @OptionalAuth()
  async createUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Session() session: UserSession
  ): Promise<UrlDto> {
    return await this.urlsService.createUrl(createUrlDto, session);
  }
}
