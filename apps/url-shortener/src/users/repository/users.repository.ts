import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './users.repository.interface';
import { Transaction } from 'sequelize';
import { User } from '../domain/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import UserModel from '../model/users.model';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(UserModel)
    private readonly model: typeof UserModel,
  ) {}

  public async save(user: User, transaction?: Transaction): Promise<void> {
    const userSaved = await this.get(user.getId());

    const userToSave: Partial<UserModel> = {
      id: user.getId(),
      name: user.getName(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      deletedAt: user.getDeletedAt(),
    };

    if (userSaved) {
      await this.model.update(userToSave, {
        where: {
          id: user.getId(),
        },
        transaction,
      });
      return;
    }

    await this.model.create(userToSave, { transaction });
  }

  public async get(id: string, transaction?: Transaction): Promise<User> {
    if (!id) return null;

    const user = await this.model.findByPk(id, { transaction });

    if (!user) return null;

    return new User({ ...user.toJSON() });
  }
}
