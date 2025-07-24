import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from 'src/auth/guards/session-auth.guard';
import { UserDto } from 'src/users/dto/user.dto';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { MeService } from './me.service';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(SessionAuthGuard)
@Controller('/users/me')
export class MeController {
    constructor(private readonly service: MeService) { }

    @Patch()
    async patch(@Body() body: UpdateUserDto, @AuthUser() user: UserDto) {
        return this.service.update(body, user);
    }

    @Delete()
    async delete(@AuthUser() user?: UserDto) {
        await this.service.delete(user);
    }
}
