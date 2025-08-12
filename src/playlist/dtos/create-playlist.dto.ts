import { IsNotEmpty, IsString, IsOptional, IsUrl, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value === 'true';
    return Boolean(value);
  })
  isPublic?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  songIds?: string[];
}
