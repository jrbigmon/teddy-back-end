import { Transaction } from 'sequelize';
import { User } from '../domain/users.entity';

export interface UserRepositoryInterface {
  create(input: User, transaction?: Transaction): Promise<void>;
  get(id: string, transaction?: Transaction): Promise<User>;
  getByEmail(email: string, transaction?: Transaction): Promise<User>;
}
