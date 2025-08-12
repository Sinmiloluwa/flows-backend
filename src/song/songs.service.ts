import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dtos';
import { Artist } from '../artist/entities/artist.entity';
import { RecentlyPlayed } from './entities/recently-played.entity';
import { CreateRecentlyPlayedDto } from './dtos/create-recently-played.dto';

@Injectable()
export class SongsService {
    constructor(
        @Inject('SONG_REPOSITORY')
        private songModel: typeof Song,
        @Inject('RECENTLY_PLAYED_REPOSITORY')
        private recentlyPlayedModel: typeof RecentlyPlayed
    ) { }

    async addSong(songDto: CreateSongDto, userId?: string, artistId?: string): Promise<Song> {
        console.log('Adding song:', songDto, 'for user:', userId, 'by artist:', artistId);

        if (!artistId) {
            throw new Error('Artist ID is required');
        }

        const songData = {
            ...songDto,
            artistId: artistId,
            audio_url: songDto.audioFileUrl,
            cover_image_url: songDto.coverArt,
            userId: userId
        };

        try {
            const song = await this.songModel.create(songData);

            const artist = await Artist.findByPk(artistId);
            if (!artist) {
                throw new Error('Artist not found');
            }

            await song.$add('artists', artist);

            const foundSong = await this.songModel.findByPk(song.id, {
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] }
                    }
                ]
            });
            if (!foundSong) {
                throw new Error('Created song not found');
            }
            return foundSong;
        } catch (error) {
            throw new Error(`Failed to create song: ${error.message}`);
        }
    }

    async findAll(): Promise<Song[]> {
        return this.songModel.findAll();
    }

    async findById(id: number): Promise<Song | null> {
        return this.songModel
            .findOne({
                where: { id },
                include: [
                    {
                        model: Artist,
                        as: 'artists',
                        through: { attributes: [] },
                        required: false
                    }
                ]
            });
    }

    async updateRecentlyPlayed(userId: string, createRecentlyPlayedDto: CreateRecentlyPlayedDto): Promise<RecentlyPlayed> {
        const song = await this.songModel.findByPk(createRecentlyPlayedDto.songId);
        if (!song) {
            throw new NotFoundException('Song not found');
        }

        const [recentlyPlayed, created] = await this.recentlyPlayedModel.findOrCreate({
            where: {
                user_id: userId,
                song_id: createRecentlyPlayedDto.songId
            },
            defaults: {
                user_id: userId,
                song_id: createRecentlyPlayedDto.songId,
                played_at: new Date()
            }
        });

        if (!created) {
            await recentlyPlayed.update({
                updatedAt: new Date(),
                played_at: new Date()
            });
        }

        return recentlyPlayed;

        // Implement the logic to update recently played songs
    }

    async getRecentlyPlayed(userId: string): Promise<RecentlyPlayed[]> {
        return this.recentlyPlayedModel.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.songModel, // Use the injected song model
                    as: 'song',
                    required: true,
                    include: [
                        {
                            model: Artist,
                            as: 'artists',
                            through: { attributes: [] }
                        }
                    ]
                }
            ],
            order: [['played_at', 'DESC']]
        });
    }
}
