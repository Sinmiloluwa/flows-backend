import { IsNotEmpty, IsString, IsOptional, IsUrl, IsNumber, IsUUID, IsArray, Min } from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  artistId: string;

  @IsOptional()
  @IsUUID()
  albumId?: string;

  @IsNotEmpty()
  @IsUrl()
  audioFileUrl: string;

  @IsOptional()
  @IsUrl()
  coverArt?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number; // in seconds

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  trackNumber?: number;

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featuredArtistIds?: string[];
}
