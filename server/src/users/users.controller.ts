import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { serializeInterceptor } from 'src/interceptors/serialize.interceptor';

@UseInterceptors(new serializeInterceptor(UserDto))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.usersService.create(body);
  }

}
