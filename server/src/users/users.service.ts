import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../password/password.service';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { DatabaseSchema, users, User, NewUser } from '../database/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DatabaseSchema>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(body: CreateUserDto): Promise<User> {
    const { email, password } = body;

    // Check if email already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      throw new ConflictException('users/email-already-exists');
    }

    const hashed = await this.passwordService.hashPassword(password);
    const newUser: NewUser = {
      email,
      password: hashed,
      providers: [],
    };

    const [createdUser] = await this.db
      .insert(users)
      .values(newUser)
      .returning();
    return createdUser;
  }
}
