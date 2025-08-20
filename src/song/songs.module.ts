import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { RecentlyPlayed } from './entities/recently-played.entity';
import { Category } from '../categories/entities/category.entity';
import { LikedSong } from '../liked-songs/entities/liked-song.entity';

@Module({
  imports: [JwtModule],
  providers: [
    SongsService,
    {
      provide: 'SONG_REPOSITORY',
      useValue: Song,
    },
    {
      provide: 'RECENTLY_PLAYED_REPOSITORY',
      useValue: RecentlyPlayed,
    },
    {
      provide: 'RECENTLY_PLAYED_REPOSITORY',
      useValue: RecentlyPlayed,
    },
    {
      provide: 'CATEGORY_REPOSITORY',
      useValue: Category,
    },
    {
      provide: 'LIKED_SONG_REPOSITORY',
      useValue: LikedSong, 
    }
  ],
  controllers: [SongsController]
})
export class SongsModule {}
