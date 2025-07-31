import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table({
  tableName: 'subscriptions',
  timestamps: false, // We use our own started_at timestamp
})
export class Subscription extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER, // Changed from UUID to INTEGER to match your existing schema
    allowNull: false,
  })
  declare user_id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Subscription plan: free, premium, family, etc.',
  })
  declare plan: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare started_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When the subscription expires. NULL for lifetime plans.',
  })
  declare expires_at: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: 'active',
    comment: 'Subscription status: active, cancelled, expired, suspended',
  })
  declare status: string;

  // Relationship
  @BelongsTo(() => User)
  declare user: User;
}
