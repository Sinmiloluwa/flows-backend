import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { Playlist } from './entities/playlist.entity';

@Module({
  imports: [JwtModule],
  providers: [
    PlaylistService,
    {
      provide: 'PLAYLIST_REPOSITORY',
      useValue: Playlist,
    }
  ],
  controllers: [PlaylistController]
})
export class PlaylistModule {}
