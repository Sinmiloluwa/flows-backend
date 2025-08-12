import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Song } from '../song/entities/song.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { PlaylistSong } from '../playlist-songs/entities/playlist-song.entity';
import { ListeningHistory } from '../listening-history/entities/listening-history.entity';
import { LikedSong } from '../liked-songs/entities/liked-song.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { SongArtist } from '../song-artists/entities/song-artist.entity';
import { SEQUELIZE } from '../../constants';
import { Category } from '../categories/entities/category.entity';
import { RecentlyPlayed } from '../song/entities/recently-played.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
       const sequelize = new Sequelize(process.env.DATABASE_URL!, {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        },
        logging: false,
      });

      sequelize.addModels([
        User,
        Artist,
        Album,
        Song,
        Playlist,
        PlaylistSong,
        ListeningHistory,
        LikedSong,
        Subscription,
        SongArtist,
        Category,
        RecentlyPlayed
      ]);
      
      // Use alter sync only if SYNC_ALTER env var is set to 'true', otherwise use fast sync
      if (process.env.SYNC_ALTER === 'true') {
        await sequelize.sync({ alter: true });
      } else {
        // For faster startup, only sync if SYNC_DB is explicitly set to 'true'
        if (process.env.SYNC_DB === 'true') {
          await sequelize.sync();
        }
        // Otherwise, skip sync for faster startup (assumes DB schema already exists)
      }
      return sequelize;
    },
  },
];
