import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  Default,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Album } from '../../album/entities/album.entity';
import { Song } from '../../song/entities/song.entity';
import { SongArtist } from '../../song-artists/entities/song-artist.entity';
import { User } from '../../user/entities/user.entity';

@Table({
  tableName: 'artists',
  timestamps: true,
})
export class Artist extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare bio: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare profilePicture: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare genre: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare debutDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare country: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare recordLabel: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare followersCount: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isVerified: boolean;

  @ForeignKey(() => User) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  // Relationship: One artist has many albums
  @HasMany(() => Album)
  declare albums: Album[];

  // Many-to-many relationship: Artist has many Songs through SongArtist
  @BelongsToMany(() => Song, () => SongArtist)
  declare songs: Song[];

  // Relationship: Artist belongs to User
  @BelongsTo(() => User)
  declare user: User;
}