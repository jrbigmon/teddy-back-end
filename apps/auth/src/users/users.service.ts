import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from './repository/users.repository.interface';
import { Transaction } from 'sequelize';
import { encryptPassword } from '../utils/crypto';
import { User } from './domain/users.entity';
import { CreateUserInputDTO, CreateUserOutputDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly repository: UserRepositoryInterface,
  ) {}

  public async create(
    input: CreateUserInputDTO,
    transaction?: Transaction,
  ): Promise<CreateUserOutputDTO> {
    const { name, email, password } = input;

    const passwordEncrypted = await encryptPassword(password);

    const user = User.create({ name, email, password: passwordEncrypted });

    await this.repository.create(user, transaction);

    return {
      id: user.getId(),
      name: user.getName(),
      createdAt: user.getCreatedAt(),
    };
  }
}
