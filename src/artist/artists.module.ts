import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Artist } from './entities/artist.entity';

@Module({
  imports: [JwtModule],
  providers: [
    ArtistsService,
    {
      provide: 'ARTIST_REPOSITORY',
      useValue: Artist,
    }
  ],
  controllers: [ArtistsController]
})
export class ArtistsModule {}
