import { IsNotEmpty, IsString, IsOptional, IsUrl, IsBoolean, IsArray, IsUUID } from 'class-validator';

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
  isPublic?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  songIds?: string[];
}
