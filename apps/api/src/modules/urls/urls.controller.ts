import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
    return await this.urlsService.createUrl(createUrlDto, session.user.id);
  }

  @Get("/me")
  @HttpCode(HttpStatus.OK)
  async getUserUrls(@Session() session: UserSession): Promise<UrlDto[]> {
    return await this.urlsService.getUserUrls(session.user.id);
  }

  @Delete("/:code")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUrl(
    @Param("code") code: string,
    @Session() session: UserSession
  ): Promise<void> {
    await this.urlsService.deleteUrl(code, session.user.id);
  }
}
