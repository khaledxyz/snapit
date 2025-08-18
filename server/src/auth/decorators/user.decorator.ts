import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../database/schema';

export const AuthUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
