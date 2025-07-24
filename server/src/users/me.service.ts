import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { DatabaseSchema, users } from 'src/database/schema';
import { UserDto } from 'src/users/dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'src/password/password.service';

@Injectable()
export class MeService {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<DatabaseSchema>,
    ) { }

    async update(body: UpdateUserDto, user: UserDto) {
        const { displayName } = body;

        await this.db
            .update(users)
            .set({ displayName })

        return { message: "success" }
    }

    async delete(user?: UserDto) {
        await this.db
            .delete(users)
            .where(eq(users.id, user.id))
            .returning();
    }
}
