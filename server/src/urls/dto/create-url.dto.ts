import { Optional } from "@nestjs/common";
import { IsString, IsUrl } from "class-validator";

export class CreateUrlDto {
    @IsString()
    @IsUrl()
    longUrl: string
}
