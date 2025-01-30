import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './repository/users.repository.interface';
import { UserCreateInputDTO } from './dto/user-create.dto';
import { User } from './domain/user.entity';
import { Transaction } from 'sequelize';
import { UserUpdateInputDTO } from './dto/user-update.dto';
import { NotFoundException } from '../../../@share/exceptions/not-found.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly repository: UserRepositoryInterface,
  ) {}

  public async get(id: string, transaction?: Transaction): Promise<User> {
    const user = await this.repository.get(id, transaction);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async create(
    input: UserCreateInputDTO,
    transaction?: Transaction,
  ): Promise<void> {
    const user = new User({
      id: input.id,
      name: input.name,
    });

    await this.repository.save(user, transaction);
  }

  public async update(
    input: UserUpdateInputDTO,
    transaction?: Transaction,
  ): Promise<void> {
    const userSaved = await this.repository.get(input.id, transaction);

    if (!userSaved) {
      await this.create(input, transaction);
      return;
    }

    userSaved.setName(input.name);

    await this.repository.save(userSaved, transaction);
  }

  public async delete(id: string, transaction?: Transaction): Promise<void> {
    const user = await this.repository.get(id, transaction);

    if (!user) return;

    user.deleted();

    await this.repository.save(user, transaction);
  }
}
