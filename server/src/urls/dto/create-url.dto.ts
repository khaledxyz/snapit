import { Transform } from "class-transformer";
import { IsAlphanumeric, IsEmpty, IsString, IsUrl, IsOptional } from "class-validator";

export class CreateUrlDto {
    @IsString()
    @IsUrl()
    longUrl: string

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString()
    @IsAlphanumeric()
    shortCode?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
