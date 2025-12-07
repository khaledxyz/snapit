import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUrlDto {
  @IsUrl({}, { message: "Original URL must be a valid URL" })
  @IsNotEmpty()
  originalUrl: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsAlphanumeric("en-US", {
    message:
      "Custom code can only contain letters, numbers, hyphens, and underscores",
  })
  customCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsString()
  expiresAt?: string;
}
