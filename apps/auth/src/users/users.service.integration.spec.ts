import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../database/database.module';
import { UserService } from './users.service';
import UserModel from './model/users.model';
import { UserQueueProducer } from '../queues/users/users.queue.producer';
import { User } from './domain/users.entity';

describe('UserService integration tests', () => {
  let moduleRef: TestingModule;
  let userService: UserService;
  let userQueueProducer: UserQueueProducer;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          database: ':memory:',
          autoLoadModels: true,
          synchronize: true,
          models: models,
          logging: false,
        }),
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userQueueProducer = moduleRef.get<UserQueueProducer>(UserQueueProducer);
  });

  beforeAll(() => {
    jest
      .spyOn(userQueueProducer, 'userCreated')
      .mockImplementation(async (_: User) => {
        return;
      });
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await moduleRef.close();
  });

  it('should be defined the userService', () => {
    expect(userService).toBeDefined();
  });

  it('should be create the user and save in the database', async () => {
    const input = {
      name: 'test',
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await userService.create(input);
    const userSaved = await UserModel.findByPk(result.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      name: input.name,
      createdAt: expect.any(Date),
    });

    expect(userSaved.toJSON()).toMatchObject({
      id: result.id,
      name: input.name,
      email: input.email,
      password: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deletedAt: null,
    });
  });
});
