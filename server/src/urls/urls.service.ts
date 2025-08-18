import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { customAlphabet } from 'nanoid';
import { eq, desc, sql, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { DatabaseSchema, urls, Url, NewUrl } from '../database/schema';
import { UserDto } from '../users/dto/user.dto';
import { CodeGeneratorService } from 'src/code-generator/code-generator.service';
import { PasswordService } from 'src/password/password.service';

@Injectable()
export class UrlsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DatabaseSchema>,
    private readonly generator: CodeGeneratorService,
    private readonly password: PasswordService,
  ) {}

  async create(body: CreateUrlDto, user?: UserDto): Promise<Url> {
    const {
      longUrl,
      password: plainPassword,
      shortCode: inputShortCode,
      description: inputDescription,
    } = body;

    let shortCode = inputShortCode;
    if (shortCode) {
      const urlExists = await this.findOne(shortCode).catch(() => null);
      if (urlExists)
        throw new ConflictException('urls/short-code-already-exists');
    } else {
      shortCode = this.generator.generate();
    }

    let hashedPassword = '';
    if (plainPassword) {
      hashedPassword = await this.password.hashPassword(plainPassword);
    }

    const newUrl: NewUrl = {
      originalUrl: longUrl,
      shortCode,
      userId: user?.id || null,
      description: inputDescription ?? '',
      password: hashedPassword,
    };

    const [url] = await this.db.insert(urls).values(newUrl).returning();
    return url;
  }

  async findOne(shortCode: string): Promise<Url> {
    const [url] = await this.db
      .update(urls)
      .set({ clicks: sql`${urls.clicks} + 1` })
      .where(eq(urls.shortCode, shortCode))
      .returning();

    if (!url) throw new NotFoundException('URL not found');
    return url;
  }

  async findAll(user?: UserDto): Promise<Url[]> {
    const links = await this.db
      .select()
      .from(urls)
      .where(eq(urls.userId, user?.id))
      .orderBy(desc(urls.createdAt));

    return links;
  }

  async delete(shortCode: string, user?: UserDto): Promise<void> {
    const result = await this.db
      .delete(urls)
      .where(and(eq(urls.shortCode, shortCode), eq(urls.userId, user.id)))
      .returning();

    if (result.length === 0) throw new NotFoundException('URL not found');
  }
}
