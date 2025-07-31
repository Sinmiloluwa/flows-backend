export class AlbumResponseDto {
  id: string;
  title: string;
  description?: string;
  coverArt?: string;
  releaseDate?: Date;
  albumType?: string;
  genre?: string;
  recordLabel?: string;
  totalTracks: number;
  totalDuration: number; // in seconds
  playCount: number;
  artistId: string;
  artist?: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
