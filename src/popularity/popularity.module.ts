import { Module } from '@nestjs/common';
import { PopularityService } from './popularity.service';
import { PopularityController } from './popularity.controller';
import { Song } from '../song/entities/song.entity';

@Module({
  providers: [
    PopularityService,
    {
      provide: 'SONG_REPOSITORY',
      useValue: Song,
    }
  ],
  controllers: [PopularityController],
  exports: [PopularityService]
})
export class PopularityModule {}
