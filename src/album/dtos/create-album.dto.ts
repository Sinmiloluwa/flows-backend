import { IsNotEmpty, IsString, IsOptional, IsUrl, IsDateString, IsUUID, IsEnum } from 'class-validator';

enum AlbumType {
  ALBUM = 'album',
  EP = 'ep',
  SINGLE = 'single',
  COMPILATION = 'compilation'
}

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUUID()
  artistId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverArt?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsEnum(AlbumType)
  albumType?: AlbumType;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  recordLabel?: string;
}
