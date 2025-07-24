import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { DatabaseSchema, User, users } from '../database/schema';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<DatabaseSchema>) { super() }

  serializeUser(user: User, done: (err: Error | null, id?: string) => void): void {
    done(null, user.id);
  }

  async deserializeUser(payload: any, done: (err: any, user?: any) => void): Promise<any> {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, payload))
        .limit(1);

      done(null, user)
    } catch (error) {
      done(error, null);
    }
  }
}
