import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { SongArtist } from '../../song-artists/entities/song-artist.entity';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { PlaylistSong } from '../../playlist-songs/entities/playlist-song.entity';
import { ListeningHistory } from '../../listening-history/entities/listening-history.entity';
import { User } from '../../user/entities/user.entity';
import { LikedSong } from '../../liked-songs/entities/liked-song.entity';

@Table({
  tableName: 'songs',
  timestamps: true,
})
export class Song extends Model {
  @ForeignKey(() => Album)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare album_id: number;

  // Relationship: Song belongs to an Album
  @BelongsTo(() => Album)
  declare album: Album;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare audio_url: string;

  @Column({
      type: DataType.INTEGER,
      allowNull: true,
  })
  declare duration: number;

  @Column({
      type: DataType.TEXT,
      allowNull: true,
  })
  declare genre: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare cover_image_url: string;

  // Many-to-many relationship: Song has many Artists through SongArtist
  @BelongsToMany(() => Artist, () => SongArtist)
  declare artists: Artist[];

  // Many-to-many relationship: Song belongs to many Playlists through PlaylistSong
  @BelongsToMany(() => Playlist, () => PlaylistSong)
  declare playlists: Playlist[];

  // Direct relationship: Song has many PlaylistSong entries
  @HasMany(() => PlaylistSong)
  declare playlistSongs: PlaylistSong[];

  // Relationship: One song has many listening history entries
  @HasMany(() => ListeningHistory)
  declare listeningHistory: ListeningHistory[];

  // Direct relationship: Song has many LikedSong entries
  @HasMany(() => LikedSong)
  declare likedSongs: LikedSong[];

  // Many-to-many relationship: Song is liked by many Users through LikedSong
  @BelongsToMany(() => User, () => LikedSong)
  declare likedByUsers: User[];
}