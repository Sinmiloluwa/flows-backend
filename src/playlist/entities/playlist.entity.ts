import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Song } from '../../song/entities/song.entity';
import { PlaylistSong } from '../../playlist-songs/entities/playlist-song.entity';

@Table({
  tableName: 'playlists',
  timestamps: true,
})
export class Playlist extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  // Relationship: Playlist belongs to a User
  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare image_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare is_public: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare created_at: Date;

  // Many-to-many relationship: Playlist has many Songs through PlaylistSong
  @BelongsToMany(() => Song, () => PlaylistSong)
  declare songs: Song[];
}
