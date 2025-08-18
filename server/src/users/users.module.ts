import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordModule } from '../password/password.module';
import { DatabaseModule } from '../database/database.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [DatabaseModule, PasswordModule],
  controllers: [UsersController, MeController],
  providers: [UsersService, MeService],
  exports: [UsersService],
})
export class UsersModule {}
