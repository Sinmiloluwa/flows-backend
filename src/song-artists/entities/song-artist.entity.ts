import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Song } from '../../song/entities/song.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Table({
  tableName: 'song_artists',
  timestamps: false, // Junction tables typically don't need timestamps
})
export class SongArtist extends Model {
  @ForeignKey(() => Song)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare song_id: number;

  @ForeignKey(() => Artist)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare artist_id: number;

  // Relationships
  @BelongsTo(() => Song)
  declare song: Song;

  @BelongsTo(() => Artist)
  declare artist: Artist;
}
