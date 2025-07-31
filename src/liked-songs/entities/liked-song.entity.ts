import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';
import { Song } from '../../song/entities/song.entity';

@Table({
  tableName: 'liked_songs',
  timestamps: false, // We use our own liked_at timestamp
})
export class LikedSong extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare user_id: number;

  @ForeignKey(() => Song)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare song_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare liked_at: Date;

  // Relationships
  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Song)
  declare song: Song;
}
