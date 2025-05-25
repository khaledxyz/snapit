import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) { }

  @Post()
  create(@Body() body: CreateUrlDto) {
    return this.urlsService.create(body);
  }

  @Get(':shortCode')
  @Redirect()
  async findOne(@Param('shortCode') shortCode: string) {
    const url = await this.urlsService.findOne(shortCode);
    return { url: url.originalUrl }
  }
}
