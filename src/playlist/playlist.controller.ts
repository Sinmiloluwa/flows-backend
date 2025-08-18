import { 
    Controller, 
    Post, 
    Get, 
    Put, 
    Delete, 
    Body, 
    Param, 
    UseGuards, 
    ValidationPipe,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto, UpdatePlaylistDto, PlaylistResponseDto } from './dtos';
import { UserGuard } from '../guards/user.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Song } from '../song/entities/song.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('playlists')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(UserGuard)
    async createPlaylist(
        @Body(ValidationPipe) createPlaylistDto: CreatePlaylistDto,
        @CurrentUser() user: any
    ): Promise<PlaylistResponseDto> {
        return await this.playlistService.createPlaylist(createPlaylistDto, user.sub);
    }

    @ApiOperation({ summary: 'Get made for you playlists' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 200, description: 'Successful retrieval of playlists.', type: [Song] })  
    @Get('made-for-you')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async getMadeForYouPlaylists(@CurrentUser() user: any): Promise<{ message: string; data: Song[] }> {
        return await this.playlistService.getMadeForYou(user.sub);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllPlaylists(): Promise<PlaylistResponseDto[]> {
        return await this.playlistService.getAllPlaylists();
    }

    @Get('my')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async getMyPlaylists(@CurrentUser() user: any): Promise<PlaylistResponseDto[]> {
        return await this.playlistService.getAllPlaylists(user.sub);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getPlaylistById(@Param('id') id: string): Promise<PlaylistResponseDto> {
        return await this.playlistService.getPlaylistById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async updatePlaylist(
        @Param('id') id: string,
        @Body(ValidationPipe) updatePlaylistDto: UpdatePlaylistDto,
        @CurrentUser() user: any
    ): Promise<PlaylistResponseDto> {
        return await this.playlistService.updatePlaylist(id, updatePlaylistDto, user.sub);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async deletePlaylist(
        @Param('id') id: string,
        @CurrentUser() user: any
    ): Promise<{ message: string }> {
        await this.playlistService.deletePlaylist(id, user.sub);
        return { message: 'Playlist deleted successfully' };
    }

    @Post(':id/songs/:songId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async addSongToPlaylist(
        @Param('id') playlistId: string,
        @Param('songId') songId: string,
        @CurrentUser() user: any
    ): Promise<{ message: string }> {
        await this.playlistService.addSongToPlaylist(playlistId, songId, user.sub);
        return { message: 'Song added to playlist successfully' };
    }

    @Delete(':id/songs/:songId')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    async removeSongFromPlaylist(
        @Param('id') playlistId: string,
        @Param('songId') songId: string,
        @CurrentUser() user: any
    ): Promise<{ message: string }> {
        await this.playlistService.removeSongFromPlaylist(playlistId, songId, user.sub);
        return { message: 'Song removed from playlist successfully' };
    }
}
