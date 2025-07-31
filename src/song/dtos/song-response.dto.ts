export class SongResponseDto {
  id: string;
  title: string;
  audioFileUrl: string;
  coverArt?: string;
  duration: number; // in seconds
  genre?: string;
  trackNumber?: number;
  lyrics?: string;
  playCount: number;
  likeCount: number;
  isExplicit: boolean;
  artistId: string;
  albumId?: string;
  artist?: {
    id: string;
    name: string;
    profilePicture?: string;
  };
  album?: {
    id: string;
    title: string;
    coverArt?: string;
  };
  featuredArtists?: Array<{
    id: string;
    name: string;
    profilePicture?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
