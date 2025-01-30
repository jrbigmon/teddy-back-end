import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import UrlModel from './urls.model';
import UserModel from '../../users/model/users.model';

@Table({
  tableName: 'clicks',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export default class ClickModel extends Model<ClickModel> {
  @PrimaryKey
  @Column
  public id: string;

  @ForeignKey(() => UrlModel)
  @Column({ field: 'url_id' })
  public urlId: string;

  @BelongsTo(() => UrlModel, 'urlId')
  public url: UrlModel;

  @ForeignKey(() => UserModel)
  @Column({ field: 'user_id' })
  public userId?: string;

  @BelongsTo(() => UserModel, 'userId')
  public user?: UserModel;

  @Column({ field: 'created_at' })
  public createdAt: Date;

  @Column({ field: 'updated_at' })
  public updatedAt: Date;

  @Column({ field: 'deleted_at' })
  public deletedAt?: Date;
}
