import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import ClickModel from './clicks.model';
import UserModel from '../../users/model/users.model';

@Table({
  tableName: 'urls',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export default class UrlModel extends Model<UrlModel> {
  @PrimaryKey
  @Column
  public id: string;

  @Column({ field: 'original_url' })
  public originalUrl: string;

  @Column({ field: 'short_url' })
  public shortUrl: string;

  @ForeignKey(() => UserModel)
  @Column({ field: 'user_id' })
  public userId?: string;

  @BelongsTo(() => UserModel, 'userId')
  public user?: UserModel;

  @HasMany(() => ClickModel, 'url_id')
  public clicks: ClickModel[];

  @Column({ field: 'created_at' })
  public createdAt: Date;

  @Column({ field: 'updated_at' })
  public updatedAt: Date;

  @Column({ field: 'deleted_at' })
  public deletedAt?: Date;
}
