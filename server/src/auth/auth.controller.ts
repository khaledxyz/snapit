import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { AuthUser } from './decorators/user.decorator';
import { User } from '../database/schema';
import { Request, Response } from 'express';
import { serializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@UseInterceptors(new serializeInterceptor(UserDto))
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@AuthUser() user: User) {
    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@AuthUser() user: User) {
    return user;
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.service.logout(req, res);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @AuthUser() user: User,
    @Req() req: any,
    @Res() res: Response,
  ) {
    // Let Passport handle the session serialization
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      // Redirect to your client app after successful login
      return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    });
  }
}
