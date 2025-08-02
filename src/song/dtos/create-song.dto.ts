import { IsNotEmpty, IsString, IsOptional, IsUrl, IsNumber, IsUUID, IsArray, Min } from 'class-validator';
import { IsValidCategory } from '../validators/is-valid-category.decorator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  // Removed artistId - now comes from authenticated artist via ArtistGuard
  
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

  @IsNotEmpty()
  @IsString()
  @IsValidCategory({
    message: 'Genre must be a valid active category. Check /categories endpoint for available options.'
  })
  genre: string;

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
