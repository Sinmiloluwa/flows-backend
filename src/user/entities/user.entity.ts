import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { ListeningHistory } from '../../listening-history/entities/listening-history.entity';
import { Song } from '../../song/entities/song.entity';
import { LikedSong } from '../../liked-songs/entities/liked-song.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare lastName: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare gender: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare country: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare profilePicture: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isEmailVerified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  // Relationship: One user has many playlists
  @HasMany(() => Playlist)
  declare playlists: Playlist[];

  // Relationship: One user has many listening history entries
  @HasMany(() => ListeningHistory)
  declare listeningHistory: ListeningHistory[];

  // Many-to-many relationship: User has many liked Songs through LikedSong
  @BelongsToMany(() => Song, () => LikedSong)
  declare likedSongs: Song[];

  // Relationship: One user has many subscriptions (current and historical)
  @HasMany(() => Subscription)
  declare subscriptions: Subscription[];

  // Relationship: One user has one current subscription
  @HasOne(() => Subscription, {
    scope: {
      status: 'active'
    }
  })
  declare currentSubscription: Subscription;
}