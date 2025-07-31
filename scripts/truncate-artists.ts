import { Sequelize } from 'sequelize-typescript';
import { Artist } from '../src/artist/entities/artist.entity';
import { Album } from '../src/album/entities/album.entity';
import { Song } from '../src/song/entities/song.entity';
import { Playlist } from '../src/playlist/entities/playlist.entity';
import { PlaylistSong } from '../src/playlist-songs/entities/playlist-song.entity';
import { ListeningHistory } from '../src/listening-history/entities/listening-history.entity';
import { LikedSong } from '../src/liked-songs/entities/liked-song.entity';
import { Subscription } from '../src/subscription/entities/subscription.entity';
import { SongArtist } from '../src/song-artists/entities/song-artist.entity';
import { User } from '../src/user/entities/user.entity';
import { config } from 'dotenv';
config();

async function truncateArtists() {
  const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
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
    SongArtist
  ]);
  await sequelize.authenticate();
  await Artist.truncate({ cascade: true, restartIdentity: true });
  await sequelize.close();
  console.log('Artists table truncated.');
}

truncateArtists().catch(console.error);
