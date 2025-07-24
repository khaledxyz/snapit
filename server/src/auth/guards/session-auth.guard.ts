import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SessionAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        return request.isAuthenticated();
    }
}
