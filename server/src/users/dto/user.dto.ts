import { Exclude, Type } from 'class-transformer';
import { IsArray, IsDate, IsString, IsOptional } from 'class-validator';
import { Provider } from '../schemas/user.schema';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  displayName: string;

  @IsString()
  email: string;

  @Exclude()
  password?: string;

  @IsArray()
  providers: Provider[];

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
