import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { DATABASE_CONNECTION } from "@infra/database/database-connection";
import * as schema from "@infra/database/schema";

import { CodeGeneratorService } from "@modules/code-generator/code-generator.service";
import { PasswordService } from "@modules/password/password.service";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { CreateUrlDto } from "./dto/create-url.dto";
import { UrlDto } from "./dto/url.dto";

@Injectable()
export class UrlsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly generator: CodeGeneratorService,
    private readonly password: PasswordService
  ) {}

  // ============================================================================
  // Public API
  // ============================================================================

  async create(createUrlDto: CreateUrlDto, userId: string): Promise<UrlDto> {
    const { originalUrl, title, description } = createUrlDto;

    const code = await this.resolveUrlCode(createUrlDto.customCode, userId);
    const passwordHash = await this.hashPasswordIfProvided(
      createUrlDto.password
    );
    const expiresAt = this.validateAndParseExpiration(createUrlDto.expiresAt);

    const [url] = await this.db
      .insert(schema.url)
      .values({
        id: nanoid(),
        code,
        originalUrl,
        title,
        description,
        passwordHash,
        expiresAt,
        userId,
      })
      .returning();

    return url;
  }

  async findUrlByCode(
    code: string
  ): Promise<typeof schema.url.$inferSelect | null> {
    const [url] = await this.db
      .select()
      .from(schema.url)
      .where(eq(schema.url.code, code))
      .limit(1);

    if (!url) {
      return null;
    }

    // Check if expired
    if (url.expiresAt && url.expiresAt <= new Date()) {
      throw new BadRequestException("This URL has expired");
    }
    return url;
  }

  async getUserUrls(userId: string): Promise<UrlDto[]> {
    const urls = await this.db
      .select()
      .from(schema.url)
      .where(eq(schema.url.userId, userId));

    return urls;
  }

  // ============================================================================
  // Create URL Helpers
  // ============================================================================

  private async resolveUrlCode(
    customCode: string | undefined,
    userId: string
  ): Promise<string> {
    if (customCode) {
      if (!userId) {
        throw new UnauthorizedException("Custom codes require authentication");
      }
      if (!(await this.isCodeAvailable(customCode))) {
        throw new ConflictException("Custom code already taken");
      }
      return customCode;
    }

    return this.generateUniqueCode();
  }

  private async generateUniqueCode(maxAttempts = 10): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const code = this.generator.generate();
      if (await this.isCodeAvailable(code)) {
        return code;
      }
    }
    throw new ConflictException("Failed to generate unique code");
  }

  private async hashPasswordIfProvided(
    password?: string
  ): Promise<string | undefined> {
    return password ? await this.password.hashPassword(password) : undefined;
  }

  private validateAndParseExpiration(expiresAt?: string): Date | undefined {
    if (!expiresAt) {
      return;
    }

    const date = new Date(expiresAt);
    if (date <= new Date()) {
      throw new BadRequestException("Expiration date must be in the future");
    }
    return date;
  }

  // ============================================================================
  // Shared Helpers
  // ============================================================================

  private async isCodeAvailable(code: string): Promise<boolean> {
    const [existingUrl] = await this.db
      .select()
      .from(schema.url)
      .where(eq(schema.url.code, code))
      .limit(1);

    return !existingUrl;
  }
}
