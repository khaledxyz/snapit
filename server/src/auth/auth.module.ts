import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './strategies/local.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { PasswordModule } from '../password/password.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GithubStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule { }
