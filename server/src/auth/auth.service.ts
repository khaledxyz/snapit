import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { eq, and, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { DatabaseSchema, User, users } from '../database/schema';
import { PasswordService } from '../password/password.service';
import { OAuthUserDto } from './dto/oauth-user.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DatabaseSchema>,
    private readonly passwordService: PasswordService,
  ) {}

  async login(email: string, password: string): Promise<User> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = result[0];

    if (!user) throw new UnauthorizedException('auth/user-not-found');

    // Check if user has a password (OAuth users might not have one)
    if (!user.password)
      throw new UnauthorizedException('auth/oauth-user-no-password');

    const isPasswordValid = await this.passwordService.verifyPassword(
      user.password,
      password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('auth/invalid-password');

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  }

  async validateOAuthLogin(payload: OAuthUserDto): Promise<User> {
    try {
      // Check if a user already exists with this provider using JSONB query
      const userWithProvider = await this.db
        .select()
        .from(users)
        .where(
          sql`${users.providers}::jsonb @> ${JSON.stringify([{ name: payload.provider, id: payload.providerId }])}::jsonb`,
        )
        .limit(1);

      if (userWithProvider.length > 0) {
        return userWithProvider[0];
      }

      // Check if a user exists with this email
      const existingUserByEmail = await this.findUserByEmail(payload.email);

      if (existingUserByEmail) {
        // User exists with this email, add the new provider to their account
        const currentProviders = existingUserByEmail.providers || [];
        const providerExists = currentProviders.some(
          (p) => p.name === payload.provider && p.id === payload.providerId,
        );

        if (!providerExists) {
          const updatedProviders = [
            ...currentProviders,
            {
              name: payload.provider,
              id: payload.providerId,
              email: payload.email,
              username: payload.username,
              connectedAt: new Date(),
            },
          ];

          const [updatedUser] = await this.db
            .update(users)
            .set({
              providers: updatedProviders,
              updatedAt: new Date(),
            })
            .where(eq(users.id, existingUserByEmail.id))
            .returning();

          return updatedUser;
        }
        return existingUserByEmail;
      }

      // Create a new user with the OAuth provider
      const newUser = {
        email: payload.email,
        providers: [
          {
            name: payload.provider,
            id: payload.providerId,
            email: payload.email,
            username: payload.username,
            connectedAt: new Date(),
          },
        ],
      };

      const [createdUser] = await this.db
        .insert(users)
        .values(newUser)
        .returning();
      return createdUser;
    } catch (error) {
      console.error('Error in validateOAuthLogin:', error);
      throw error;
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve) => {
      req.logout(() => {
        res.json({ message: 'auth/logged-out' });
        resolve();
      });
    });
  }
}
