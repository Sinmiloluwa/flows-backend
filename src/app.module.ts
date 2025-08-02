import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ArtistsModule } from './artist/artists.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoriesModule } from './categories/categories.module';
import { SongsModule } from './song/songs.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PopularityModule } from './popularity/popularity.module';
import { ListeningModule } from './listening/listening.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, 
    }),
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    ArtistsModule,
    CategoriesModule,
    SongsModule,
    PlaylistModule,
    PopularityModule,
    ListeningModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
