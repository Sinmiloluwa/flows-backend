import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dtos';
import { UserGuard } from '../guards/user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ArtistGuard } from './guards/artist.guard';
import { CurrentArtist } from './decorators/current-artist.decorator';

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

}
