import { Injectable, Inject } from '@nestjs/common';
import { ListeningHistory } from '../listening-history/entities/listening-history.entity';

export interface PlayTrackDto {
  songId: string;
  userId?: string;
  playedAt?: Date;
  duration?: number; // How long the song was played (in seconds)
  completed?: boolean; // Whether the song was played to completion
}

@Injectable()
export class ListeningTrackingService {
  constructor(
    @Inject('LISTENING_HISTORY_REPOSITORY') 
    private readonly listeningHistoryModel: typeof ListeningHistory
  ) {}

  async trackPlay(playData: PlayTrackDto): Promise<void> {
    try {
      await this.listeningHistoryModel.create({
        song_id: playData.songId,
        user_id: playData.userId || null,
        played_at: playData.playedAt || new Date()
        // Note: duration and completed tracking would need additional columns in the entity
      });
    } catch (error) {
      console.error('Error tracking play:', error);
      // Don't throw error to avoid disrupting music playback
    }
  }

  async getUserListeningHistory(
    userId: string, 
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const history = await this.listeningHistoryModel.findAll({
        where: { user_id: userId },
        order: [['played_at', 'DESC']],
        limit,
        offset,
        include: [
          {
            association: 'song',
            include: ['artists']
          }
        ]
      });

      return history.map(record => ({
        id: record.id,
        playedAt: record.played_at,
        song: {
          id: record.song.id,
          title: record.song.title,
          duration: record.song.duration,
          artist: record.song.artists?.[0]?.name || 'Unknown Artist'
        }
      }));
    } catch (error) {
      throw new Error(`Failed to get listening history: ${error.message}`);
    }
  }

  async getMostPlayedByUser(
    userId: string, 
    timeframe: 'week' | 'month' | 'year' | 'all' = 'all',
    limit: number = 20
  ): Promise<any[]> {
    try {
      // This would require a more complex query with grouping
      // For now, return a simplified version
      const history = await this.listeningHistoryModel.findAll({
        where: { user_id: userId },
        limit: limit * 5, // Get more to find most played
        include: [
          {
            association: 'song',
            include: ['artists']
          }
        ]
      });

      // Group by song and count plays
      const songCounts = history.reduce((acc, record) => {
        const songId = record.song.id;
        if (!acc[songId]) {
          acc[songId] = {
            song: record.song,
            playCount: 0
          };
        }
        acc[songId].playCount++;
        return acc;
      }, {});

      // Sort by play count and return top songs
      return Object.values(songCounts)
        .sort((a: any, b: any) => b.playCount - a.playCount)
        .slice(0, limit)
        .map((item: any, index) => ({
          rank: index + 1,
          playCount: item.playCount,
          song: {
            id: item.song.id,
            title: item.song.title,
            artist: item.song.artists?.[0]?.name || 'Unknown Artist'
          }
        }));
    } catch (error) {
      throw new Error(`Failed to get most played songs: ${error.message}`);
    }
  }
}
