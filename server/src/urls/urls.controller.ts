import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthUser } from '../auth/decorators/user.decorator';
import { UserDto } from '../users/dto/user.dto';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';

@Controller('urls')
export class UrlsController {
  constructor(private readonly service: UrlsService) { }

  @Post()
  async create(@Body() body: CreateUrlDto, @AuthUser() user?: UserDto) {
    return await this.service.create(body, user);
  }

  @Get()
  @UseGuards(SessionAuthGuard)
  async findAll(@AuthUser() user?: UserDto) {
    return await this.service.findAll(user);
  }

  @Delete('/:shortCode([0-9A-Za-z]{7})')
  @UseGuards(SessionAuthGuard)
  async delete(@Param('shortCode') shortCode: string, @AuthUser() user?: UserDto) {
    return await this.service.delete(shortCode, user);
  }
}