import { Controller, Post, Get, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ListeningTrackingService, PlayTrackDto } from './listening-tracking.service';
import { UserGuard } from '../guards/user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('listening')
export class ListeningController {
  constructor(private readonly listeningService: ListeningTrackingService) {}

  @Post('track')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async trackPlay(
    @Body() playData: Omit<PlayTrackDto, 'userId'>,
    @CurrentUser() user: any
  ): Promise<{ message: string }> {
    await this.listeningService.trackPlay({
      ...playData,
      userId: user.sub
    });
    
    return { message: 'Play tracked successfully' };
  }

  @Post('track/anonymous')
  @HttpCode(HttpStatus.OK)
  async trackAnonymousPlay(
    @Body() playData: Pick<PlayTrackDto, 'songId' | 'playedAt' | 'duration' | 'completed'>
  ): Promise<{ message: string }> {
    await this.listeningService.trackPlay(playData);
    return { message: 'Anonymous play tracked successfully' };
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async getListeningHistory(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<any[]> {
    const limitNum = limit ? parseInt(limit) : 50;
    const offsetNum = offset ? parseInt(offset) : 0;
    
    return await this.listeningService.getUserListeningHistory(
      user.sub, 
      limitNum, 
      offsetNum
    );
  }

  @Get('most-played')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  async getMostPlayed(
    @CurrentUser() user: any,
    @Query('timeframe') timeframe?: 'week' | 'month' | 'year' | 'all',
    @Query('limit') limit?: string
  ): Promise<any[]> {
    const limitNum = limit ? parseInt(limit) : 20;
    const timeframeValue = timeframe || 'all';
    
    return await this.listeningService.getMostPlayedByUser(
      user.sub, 
      timeframeValue, 
      limitNum
    );
  }
}
