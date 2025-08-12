import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { RecentlyPlayed } from './entities/recently-played.entity';

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
  ],
  controllers: [SongsController]
})
export class SongsModule {}
