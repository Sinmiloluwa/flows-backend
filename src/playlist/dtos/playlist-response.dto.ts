export class PlaylistResponseDto {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  totalSongs: number;
  totalDuration: number; // in seconds
  playCount: number;
  userId: string;
  user?: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  songs?: Array<{
    id: string;
    title: string;
    duration: number;
    artist: {
      id: string;
      name: string;
    };
    addedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
