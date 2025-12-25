import { Exclude } from "class-transformer";

export class UrlDto {
  id: string;
  code: string;
  originalUrl: string;
  title?: string;
  description?: string;
  clickCount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;

  @Exclude()
  passwordHash: string;
}
