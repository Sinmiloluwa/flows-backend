import { Injectable, Inject } from '@nestjs/common';
import { Song } from '../song/entities/song.entity';
import { Artist } from '../artist/entities/artist.entity';
import { SongArtist } from '../song-artists/entities/song-artist.entity';
import { ListeningHistory } from '../listening-history/entities/listening-history.entity';
import { LikedSong } from '../liked-songs/entities/liked-song.entity';
import { PlaylistSong } from '../playlist-songs/entities/playlist-song.entity';
import { Op } from 'sequelize';

export interface PopularityMetrics {
  songId: string;
  title: string;
  artist: string;
  coverImage?: string;
  playCount: number;
  likeCount: number;
  playlistAddCount: number;
  recentPlays: number; // plays in last 7 days
  popularityScore: number;
  rank: number;
}

export interface PopularityFilters {
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
  genre?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class PopularityService {
  constructor(
    @Inject('SONG_REPOSITORY') private readonly songModel: typeof Song
  ) {}

  async getPopularSongs(filters: PopularityFilters = {}): Promise<PopularityMetrics[]> {
    const {
      timeframe = 'all',
      genre,
      limit = 50,
      offset = 0
    } = filters;

    // Calculate date range based on timeframe
    const dateFilter = this.getDateFilter(timeframe);

    // Get songs with popularity metrics
    const songs = await this.songModel.findAll({
      where: genre ? { genre } : {},
      include: [
        {
          model: Artist,
          as: 'artists',
          through: { attributes: [] }, // Don't include the join table attributes
          required: false
        },
        {
          model: ListeningHistory,
          as: 'listeningHistory',
          required: false
        },
        {
          model: LikedSong,
          as: 'likedSongs',
          required: false
        },
        {
          model: PlaylistSong,
          as: 'playlistSongs', 
          required: false
        }
      ],
      limit,
      offset
    });

    // Calculate popularity metrics for each song
    const popularityMetrics = await Promise.all(
      songs.map(async (song) => await this.calculateSongPopularity(song, timeframe))
    );

    // Sort by popularity score and add rankings
    const rankedSongs = popularityMetrics
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .map((song, index) => ({ ...song, rank: index + 1 }));

    return rankedSongs;
  }

  async getTrendingSongs(limit: number = 20): Promise<PopularityMetrics[]> {
    // Trending focuses on recent activity (last 7 days) with higher weight
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const songs = await this.songModel.findAll({
      include: [
        {
          model: Artist,
          as: 'artists',
          through: { attributes: [] }, // Don't include the join table attributes
          required: false
        },
        {
          model: ListeningHistory,
          as: 'listeningHistory',
          where: {
            played_at: { [Op.gte]: lastWeek }
          },
          required: true // Only songs with recent plays
        },
        {
          model: LikedSong,
          as: 'likedSongs',
          where: {
            liked_at: { [Op.gte]: lastWeek }
          },
          required: false
        }
      ],
      limit: limit * 2 // Get more to filter trending ones
    });

    const trendingMetrics = await Promise.all(
      songs.map(async (song) => await this.calculateTrendingScore(song))
    );

    return trendingMetrics
      .filter(song => song.popularityScore > 0)
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, limit)
      .map((song, index) => ({ ...song, rank: index + 1 }));
  }

  async getSongPopularityById(songId: string): Promise<PopularityMetrics | null> {
    const song = await this.songModel.findByPk(songId, {
      include: [
        {
          model: Artist,
          as: 'artists',
          through: { attributes: [] }, // Don't include the join table attributes
          required: false
        },
        {
          model: ListeningHistory,
          as: 'listeningHistory'
        },
        {
          model: LikedSong,
          as: 'likedSongs'
        },
        {
          model: PlaylistSong,
          as: 'playlistSongs'
        }
      ]
    });

    if (!song) return null;

    return await this.calculateSongPopularity(song, 'all');
  }

  private async calculateSongPopularity(song: any, timeframe: string): Promise<PopularityMetrics> {
    const dateFilter = this.getDateFilter(timeframe);
    
    // Count plays with correct column name
    const playCount = await ListeningHistory.count({
      where: {
        song_id: song.id,
        ...(dateFilter.created_at ? { played_at: dateFilter.created_at } : {})
      }
    });

    // Count likes
    const likeCount = await LikedSong.count({
      where: { song_id: song.id }
    });

    // Count playlist additions
    const playlistAddCount = await PlaylistSong.count({
      where: { song_id: song.id }
    });

    // Count recent plays (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentPlays = await ListeningHistory.count({
      where: {
        song_id: song.id,
        played_at: { [Op.gte]: lastWeek }
      }
    });

    // Calculate popularity score using weighted formula
    const popularityScore = this.calculatePopularityScore({
      playCount,
      likeCount,
      playlistAddCount,
      recentPlays,
      timeframe
    });

    console.log(song);

    return {
      songId: song.id,
      title: song.title,
      artist: song.artists?.[0]?.name || 'Unknown Artist',
      coverImage: song.cover_image_url,
      playCount,
      likeCount,
      playlistAddCount,
      recentPlays,
      popularityScore,
      rank: 0 // Will be set later
    };
  }

  private async calculateTrendingScore(song: any): Promise<PopularityMetrics> {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // For trending, focus heavily on recent activity
    const recentPlays = await ListeningHistory.count({
      where: {
        song_id: song.id,
        played_at: { [Op.gte]: lastWeek }
      }
    });

    const recentLikes = await LikedSong.count({
      where: {
        song_id: song.id,
        liked_at: { [Op.gte]: lastWeek }
      }
    });

    // Trending score heavily weights recent activity
    const trendingScore = (recentPlays * 3) + (recentLikes * 5);

    return {
      songId: song.id,
      title: song.title,
      artist: song.artists?.[0]?.name || 'Unknown Artist',
      coverImage: song.cover_image_url,
      playCount: recentPlays,
      likeCount: recentLikes,
      playlistAddCount: 0,
      recentPlays,
      popularityScore: trendingScore,
      rank: 0
    };
  }

  private calculatePopularityScore(metrics: {
    playCount: number;
    likeCount: number;
    playlistAddCount: number;
    recentPlays: number;
    timeframe: string;
  }): number {
    const { playCount, likeCount, playlistAddCount, recentPlays, timeframe } = metrics;

    // Base weights
    let playWeight = 1;
    let likeWeight = 3;
    let playlistWeight = 2;
    let recentWeight = 2;

    // Adjust weights based on timeframe
    if (timeframe === 'week' || timeframe === 'day') {
      recentWeight = 4; // Boost recent activity for short timeframes
    }

    // Calculate weighted score
    const score = (playCount * playWeight) + 
                  (likeCount * likeWeight) + 
                  (playlistAddCount * playlistWeight) + 
                  (recentPlays * recentWeight);

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  private getDateFilter(timeframe: string): any {
    const now = new Date();
    
    switch (timeframe) {
      case 'day':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return { created_at: { [Op.gte]: yesterday } };
        
      case 'week':
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        return { created_at: { [Op.gte]: lastWeek } };
        
      case 'month':
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return { created_at: { [Op.gte]: lastMonth } };
        
      case 'year':
        const lastYear = new Date(now);
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        return { created_at: { [Op.gte]: lastYear } };
        
      default: // 'all'
        return {};
    }
  }
}
