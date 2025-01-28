import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './users.repository.interface';
import UserModel from '../model/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { User } from '../domain/users.entity';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(UserModel)
    private readonly model: typeof UserModel,
  ) {}

  public async create(input: User, transaction?: Transaction): Promise<void> {
    await this.model.create(
      {
        id: input.getId(),
        name: input.getName(),
        email: input.getEmail(),
        password: input.getPassword(),
        createdAt: input.getCreatedAt(),
        updatedAt: input.getUpdatedAt(),
      },
      { transaction },
    );
  }

  public async get(id: string, transaction?: Transaction): Promise<User> {
    if (!id) return null;

    const user = await this.model.findByPk(id, { transaction });

    if (!user) return null;

    const { name, email, password, createdAt, updatedAt, deletedAt } =
      user.toJSON();

    return new User({
      id,
      name,
      email,
      password,
      createdAt,
      updatedAt,
      deletedAt,
    });
  }
}
