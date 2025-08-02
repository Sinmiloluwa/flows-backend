import { Inject, Injectable } from '@nestjs/common';
import { Song } from './entities/song.entity';
import { CreateSongDto } from './dtos';

@Injectable()
export class SongsService {
    constructor(
        @Inject('SONG_REPOSITORY')
        private songModel: typeof Song
    ) {}

    async addSong(songDto: CreateSongDto, userId?: string, artistId?: string): Promise<Song> {
        console.log('Adding song:', songDto, 'for user:', userId, 'by artist:', artistId);
        
        if (!artistId) {
            throw new Error('Artist ID is required');
        }
        
        const songData = {
            ...songDto,
            artistId: artistId,
            audio_url: songDto.audioFileUrl,
            userId: userId
        };
        
        const song = await this.songModel.create(songData);
        return song;
    }

    async findAll(): Promise<Song[]> {
        return this.songModel.findAll();
    }

    async findById(id: number): Promise<Song | null> {
        return this.songModel.findByPk(id);
    }   
}
