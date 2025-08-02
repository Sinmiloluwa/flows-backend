import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';

@Module({
  imports: [JwtModule],
  providers: [
    SongsService,
    {
      provide: 'SONG_REPOSITORY',
      useValue: Song,
    }
  ],
  controllers: [SongsController]
})
export class SongsModule {}
