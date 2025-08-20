import { Body, Controller, Get, Param, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dtos';
import { UserGuard } from '../guards/user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ArtistGuard } from './guards/artist.guard';
import { CurrentArtist } from './decorators/current-artist.decorator';
import { CreateRecentlyPlayedDto } from './dtos/create-recently-played.dto';
import { Song } from './entities/song.entity';

@Controller('songs')
export class SongsController {
    constructor(
        private songsService: SongsService
    ) {}

    @UseGuards(UserGuard, ArtistGuard)
    @Post()
    createSong(
        @Body(ValidationPipe) createSongDto: CreateSongDto,
        @CurrentUser() user: any,
        @CurrentArtist() artist: any
    ): Promise<any> {
        return this.songsService.addSong(createSongDto, user.sub, artist.id);
    }

    @UseGuards(UserGuard)
    @Get()
    findAllSongs(@CurrentUser() user: any): Promise<any[]> {
        console.log(`Songs fetched by user: ${user ? user.sub : 'anonymous'}`);
        return this.songsService.findAll();
    }

    @UseGuards(UserGuard)
    @Post('recently-played')
    updateRecentlyPlayed(@Body() createRecentlyPlayedDto :CreateRecentlyPlayedDto,@CurrentUser() user: any) {
        console.log(`Updating recently played songs for user: ${user ? user.sub : 'anonymous'}`);
        return this.songsService.updateRecentlyPlayed(user.sub, createRecentlyPlayedDto);
    }

    @UseGuards(UserGuard)
    @Get('recently-played-songs')
    getRecentlyPlayed(@CurrentUser() user: any, @Query('limit') limit: number = 10): Promise<any[]> {
        return this.songsService.getRecentlyPlayed(user.sub, limit);
    }

    @UseGuards(UserGuard)
    @Get('recommendations')
    getRecommendations(@CurrentUser() user: any): Promise<any[]> {
        return this.songsService.getRecommendations(user.sub);
    }

    @UseGuards(UserGuard)
    @Get('liked-songs')
    getLikedSongs(@CurrentUser() user: any): Promise<any[]> {
        return this.songsService.getLikedSongs(user.sub);
    }

    @UseGuards(UserGuard)
    @Get(':id')
    findSongById(
        @CurrentUser() user: any,
        @CurrentArtist() artist: any,
        @Param('id') id: number
    ): Promise<any> {
        console.log(`Song fetched by user: ${user ? user.sub : 'anonymous'}, artist: ${artist ? artist.id : 'none'}`);
        return this.songsService.findById(id);
    }
    
    @UseGuards(UserGuard)
    @Get('songs-by-category/:id')
    findByCategory(@Param('id') id: number): Promise<Song[]> {
        return this.songsService.findByCategory(id);
    }

    @UseGuards(UserGuard)
    @Post(':id/like')
    likeSong(@CurrentUser() user: any, @Param('id') id: number): Promise<void> {
        return this.songsService.likeSong(user.sub, id);
    }
}
