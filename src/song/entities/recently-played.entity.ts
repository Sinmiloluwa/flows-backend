import { Column, DataType, ForeignKey, HasMany, Table, Model, BelongsTo } from "sequelize-typescript";
import { Song } from "./song.entity";
import { User } from "../../user/entities/user.entity";

@Table({
    tableName: 'recently_played',
    timestamps: true
})
export class RecentlyPlayed extends Model {
    @ForeignKey(() => Song)
      @Column({
        type: DataType.INTEGER,
        allowNull: false,
      })
      declare song_id: number;

      @ForeignKey(() => User)
      @Column({
        type: DataType.INTEGER,
        allowNull: false,
      })
      declare user_id: number;

      @Column({
        type: DataType.DATE,
        allowNull: false,
      })
      declare played_at: Date;

      @BelongsTo(() => Song)
      declare song: Song;

      @BelongsTo(() => User)
      declare user: User;

}
