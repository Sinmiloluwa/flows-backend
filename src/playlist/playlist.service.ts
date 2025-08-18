import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistDto, UpdatePlaylistDto, PlaylistResponseDto } from './dtos';
import { Song } from '../song/entities/song.entity';
import { Artist } from '../artist/entities/artist.entity';
import { PlaylistSong } from '../playlist-songs/entities/playlist-song.entity';
import { Sequelize, Op, QueryTypes } from 'sequelize';

@Injectable()
export class PlaylistService {
    constructor(
        @Inject('PLAYLIST_REPOSITORY') private readonly playlistModel: typeof Playlist,
        @Inject('SONG_REPOSITORY') private readonly songModel: typeof Song,
    ) { }

    async createPlaylist(createPlaylistDto: CreatePlaylistDto, userId: string): Promise<PlaylistResponseDto> {
        try {
            const playlist = await this.playlistModel.create({
                name: createPlaylistDto.name,
                description: createPlaylistDto.description,
                is_public: createPlaylistDto.isPublic || false,
                image_url: createPlaylistDto.coverImage || null,
                user_id: userId
            });

            // If songIds are provided, add songs to playlist
            if (createPlaylistDto.songIds && createPlaylistDto.songIds.length > 0) {
                await this.addSongsToPlaylist(playlist.id, createPlaylistDto.songIds);
            }

            return this.formatPlaylistResponse(playlist);
        } catch (error) {
            throw new Error(`Failed to create playlist: ${error.message}`);
        }
    }

    async getAllPlaylists(userId?: string): Promise<PlaylistResponseDto[]> {
        try {
            const whereCondition = userId
                ? { user_id: userId }
                : { is_public: true }; // Only show public playlists if no user

            const playlists = await this.playlistModel.findAll({
                // where: whereCondition,
                include: [
                    {
                        model: Song,
                        through: { attributes: [] },
                        include: [
                            {
                                model: Artist,
                                as: 'artists'
                            }
                        ]
                    }
                ]
            });

            return playlists.map(playlist => this.formatPlaylistResponse(playlist));
        } catch (error) {
            throw new Error(`Failed to retrieve playlists: ${error.message}`);
        }
    }

    async getPlaylistById(id: string, userId?: string): Promise<PlaylistResponseDto> {
        try {
            const playlist = await this.playlistModel.findByPk(id, {
                include: [
                    {
                        model: Song,
                        through: { attributes: [] },
                        include: [
                            {
                                model: Artist,
                                as: 'artists'
                            }
                        ]
                    }
                ]
            });

            if (!playlist) {
                throw new NotFoundException('Playlist not found');
            }

            // Check if user can access this playlist
            if (!playlist.is_public && (!userId || playlist.user_id.toString() !== userId)) {
                throw new ForbiddenException('Access denied to private playlist');
            }

            return this.formatPlaylistResponse(playlist);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to retrieve playlist: ${error.message}`);
        }
    }

    async updatePlaylist(id: string, updatePlaylistDto: UpdatePlaylistDto, userId: string): Promise<PlaylistResponseDto> {
        try {
            const playlist = await this.playlistModel.findByPk(id);

            if (!playlist) {
                throw new NotFoundException('Playlist not found');
            }

            if (playlist.user_id.toString() !== userId) {
                throw new ForbiddenException('You can only update your own playlists');
            }

            await playlist.update({
                name: updatePlaylistDto.name || playlist.name,
                description: updatePlaylistDto.description || playlist.description,
                is_public: updatePlaylistDto.isPublic !== undefined ? updatePlaylistDto.isPublic : playlist.is_public
            });

            return this.formatPlaylistResponse(playlist);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to update playlist: ${error.message}`);
        }
    }

    async deletePlaylist(id: string, userId: string): Promise<void> {
        try {
            const playlist = await this.playlistModel.findByPk(id);

            if (!playlist) {
                throw new NotFoundException('Playlist not found');
            }

            if (playlist.user_id.toString() !== userId) {
                throw new ForbiddenException('You can only delete your own playlists');
            }

            await playlist.destroy();
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to delete playlist: ${error.message}`);
        }
    }

    async addSongToPlaylist(playlistId: string, songId: string, userId: string): Promise<void> {
        try {
            const playlist = await this.playlistModel.findByPk(playlistId);


            if (!playlist) {
                throw new NotFoundException('Playlist not found');
            }

            if (playlist.user_id.toString() !== userId.toString()) {
                throw new ForbiddenException('You can only modify your own playlists');
            }

            // Check if song exists
            const song = await Song.findByPk(songId);
            if (!song) {
                throw new NotFoundException('Song not found');
            }

            // Add song to playlist
            await PlaylistSong.create({
                playlist_id: playlistId,
                song_id: songId
            });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to add song to playlist: ${error.message}`);
        }
    }

    async removeSongFromPlaylist(playlistId: string, songId: string, userId: string): Promise<void> {
        try {
            const playlist = await this.playlistModel.findByPk(playlistId);

            if (!playlist) {
                throw new NotFoundException('Playlist not found');
            }

            if (playlist.user_id.toString() !== userId) {
                throw new ForbiddenException('You can only modify your own playlists');
            }

            await PlaylistSong.destroy({
                where: {
                    playlist_id: playlistId,
                    song_id: songId
                }
            });
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to remove song from playlist: ${error.message}`);
        }
    }

    private async addSongsToPlaylist(playlistId: string, songIds: string[]): Promise<void> {
        const playlistSongs = songIds.map(songId => ({
            playlist_id: playlistId,
            song_id: songId
        }));

        await PlaylistSong.bulkCreate(playlistSongs);
    }

    private formatPlaylistResponse(playlist: Playlist): PlaylistResponseDto {
        return {
            id: playlist.id.toString(),
            name: playlist.name,
            description: playlist.description,
            coverImage: playlist.image_url,
            isPublic: playlist.is_public,
            totalSongs: playlist.songs ? playlist.songs.length : 0,
            totalDuration: playlist.songs ? playlist.songs.reduce((total, song) => total + song.duration, 0) : 0,
            playCount: 0,
            userId: playlist.user_id.toString(),
            songs: playlist.songs ? playlist.songs.map(song => ({
                id: song.id.toString(),
                title: song.title,
                duration: song.duration,
                artist: {
                    id: song.artists && song.artists[0] ? song.artists[0].id.toString() : '',
                    name: song.artists && song.artists[0] ? song.artists[0].name : 'Unknown Artist'
                },
                addedAt: new Date() // TODO: Get actual addedAt from PlaylistSong
            })) : [],
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt
        };
    }

    async getMadeForYou(userId: string): Promise<Song[]> {
        if (!this.songModel.sequelize) {
            throw new Error('Sequelize instance is not available on songModel');
        }
        const favoriteGenres = await this.songModel.sequelize.query(
            `SELECT s.genre, COUNT(*) as count
         FROM recently_played rp
         JOIN songs s ON rp.song_id = s.id
         WHERE rp.user_id = :userId AND s.genre IS NOT NULL
         GROUP BY s.genre
         ORDER BY count DESC
         LIMIT 2`,
            { replacements: { userId }, type: QueryTypes.SELECT }
        );

        let recommendations: Song[] = [];
        for (const { genre } of favoriteGenres as any[]) {
            const songs = await this.songModel.findAll({
                where: {
                    genre,
                    id: {
                        [Op.notIn]: Sequelize.literal(`(
                        SELECT song_id FROM recently_played WHERE user_id = '${userId}'
                    )`)
                    }
                },
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] }
                    }
                ],
                limit: 2
            });
            recommendations.push(...songs);
        }

        // Add trending songs as a fallback
        if (recommendations.length < 6) {
            const trendingSongs = await this.songModel.findAll({
                where: {
                    id: {
                        [Op.notIn]: Sequelize.literal(`(
                        SELECT song_id FROM recently_played WHERE user_id = '${userId}'
                    )`)
                    }
                },
                order: [['createdAt', 'DESC']],
                limit: 6 - recommendations.length,
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] }
                    }
                ]
            });
            recommendations.push(...trendingSongs);
        }

        return recommendations;
    }
}
