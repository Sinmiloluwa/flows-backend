import { Inject, Injectable } from '@nestjs/common';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dtos';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class SongsService {
    constructor(
        @Inject('SONG_REPOSITORY')
        private songModel: typeof Song
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
}
