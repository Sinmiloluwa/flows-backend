import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Song } from '../../song/entities/song.entity';

@Table({
  tableName: 'playlist_songs',
  timestamps: false, // We have our own added_at timestamp
})
export class PlaylistSong extends Model {
  @ForeignKey(() => Playlist)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare playlist_id: number;

  @ForeignKey(() => Song)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare song_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare position: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare added_at: Date;

  // Relationships
  @BelongsTo(() => Playlist)
  declare playlist: Playlist;

  @BelongsTo(() => Song)
  declare song: Song;
}
