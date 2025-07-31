export class ListeningHistoryResponseDto {
  id: string;
  playedAt: Date;
  playbackPercentage: number;
  duration: number;
  userId: string;
  songId: string;
  song?: {
    id: string;
    title: string;
    duration: number;
    coverArt?: string;
    artist: {
      id: string;
      name: string;
    };
    album?: {
      id: string;
      title: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
