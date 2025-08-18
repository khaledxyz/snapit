import { Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';

@UseGuards(SessionAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly service: AccountService) {}
}
