import { Transaction } from 'sequelize';
import { User } from '../domain/users.entity';
import { UserRepositoryInterface } from './users.repository.interface';

export class UserInMemoryRepository implements UserRepositoryInterface {
  private users: User[] = [];

  public async create(input: User, _: Transaction): Promise<void> {
    this.users.push(input);
  }

  public async get(id: string, _: Transaction): Promise<User> {
    return this.users.find((user) => user.getId() === id);
  }

  public async getByEmail(
    email: string,
    transaction?: Transaction,
  ): Promise<User> {
    return this.users.find((user) => user.getEmail() === email);
  }
}
