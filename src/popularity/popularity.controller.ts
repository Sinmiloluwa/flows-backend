import { Controller, Get, Query, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { PopularityService, PopularityMetrics, PopularityFilters } from './popularity.service';

@Controller('popularity')
export class PopularityController {
  constructor(private readonly popularityService: PopularityService) {}

  @Get('songs')
  @HttpCode(HttpStatus.OK)
  async getPopularSongs(
    @Query('timeframe') timeframe?: 'day' | 'week' | 'month' | 'year' | 'all',
    @Query('genre') genre?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<PopularityMetrics[]> {
    const filters: PopularityFilters = {
      timeframe: timeframe || 'all',
      genre,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    return await this.popularityService.getPopularSongs(filters);
  }

  @Get('trending')
  @HttpCode(HttpStatus.OK)
  async getTrendingSongs(
    @Query('limit') limit?: string
  ): Promise<PopularityMetrics[]> {
    const limitNum = limit ? parseInt(limit) : 20;
    return await this.popularityService.getTrendingSongs(limitNum);
  }

  @Get('songs/:id')
  @HttpCode(HttpStatus.OK)
  async getSongPopularity(
    @Param('id') songId: string
  ): Promise<PopularityMetrics | null> {
    return await this.popularityService.getSongPopularityById(songId);
  }

  @Get('charts/top100')
  @HttpCode(HttpStatus.OK)
  async getTop100(): Promise<PopularityMetrics[]> {
    return await this.popularityService.getPopularSongs({ limit: 100 });
  }

  @Get('charts/:timeframe')
  @HttpCode(HttpStatus.OK)
  async getChartsByTimeframe(
    @Param('timeframe') timeframe: 'day' | 'week' | 'month' | 'year',
    @Query('limit') limit?: string
  ): Promise<PopularityMetrics[]> {
    const limitNum = limit ? parseInt(limit) : 50;
    return await this.popularityService.getPopularSongs({ 
      timeframe, 
      limit: limitNum 
    });
  }
}
