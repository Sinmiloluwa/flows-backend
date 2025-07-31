import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Song } from '../../song/entities/song.entity';
import { Artist } from '../../artist/entities/artist.entity';

@Table({
  tableName: 'albums',
  timestamps: true,
})
export class Album extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @ForeignKey(() => Artist)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare artist_id: number;

  @BelongsTo(() => Artist)
  declare artist: Artist;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare cover_image_url: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare release_date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare created_at: Date;

  // Relationship: One album has many songs
  @HasMany(() => Song)
  declare songs: Song[];
}
