import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Playlist } from '../playlist/entities/playlist.entity';
import { Song } from '../song/entities/song.entity';
import { Artist } from '../artist/entities/artist.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    {
      provide: 'PLAYLIST_REPOSITORY',
      useValue: Playlist,
    },
    {
      provide: 'SONG_REPOSITORY', 
      useValue: Song,
    },
    {
      provide: 'ARTIST_REPOSITORY',
      useValue: Artist,
    },
    SearchService
  ],
  controllers: [SearchController]
})
export class SearchModule {}
