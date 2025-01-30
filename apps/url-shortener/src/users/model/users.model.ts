import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export default class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @Column({ field: 'deleted_at' })
  deletedAt?: Date;
}
