import { Transaction } from 'sequelize';
import { User } from '../domain/user.entity';

export interface UserRepositoryInterface {
  save(user: User, transaction?: Transaction): Promise<void>;
  get(id: string, transaction?: Transaction): Promise<User>;
}
