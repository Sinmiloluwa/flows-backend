export class ArtistResponseDto {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  genre?: string;
  country?: string;
  recordLabel?: string;
  createdAt: Date;
  updatedAt: Date;
}
