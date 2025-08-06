import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Playlist } from '../playlist/entities/playlist.entity';
import { Song } from '../song/entities/song.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Op } from 'sequelize';

@Injectable()
export class SearchService {
  constructor(
    @Inject('PLAYLIST_REPOSITORY') private readonly playlistModel: typeof Playlist,
    @Inject('SONG_REPOSITORY') private readonly songModel: typeof Song,
    @Inject('ARTIST_REPOSITORY') private readonly artistModel: typeof Artist
  ) {}

  async searchAll(query: string) {
    const playlists = await this.playlistModel.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` },
      },
    });

    const songs = await this.songModel.findAll({
      where: {
        title: { [Op.iLike]: `%${query}%` },
      },
    });

    const artists = await this.artistModel.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` },
      },
    });

    return { playlists, songs, artists };
  }
}