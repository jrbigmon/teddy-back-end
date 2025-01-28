import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { models } from '../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoginModule } from './login.module';
import { UserService } from '../users/users.service';

describe('LoginService integration tests', () => {
  let moduleRef: TestingModule;
  let loginService: LoginService;
  let userService: UserService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        LoginModule,
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

    loginService = moduleRef.get<LoginService>(LoginService);
    userService = moduleRef.get<UserService>(UserService);
  });

  beforeAll(async () => {
    const userInput = {
      name: 'test',
      email: 'test@example.com',
      password: 'password123',
    };

    await userService.create(userInput);
  });

  it('should be defined the loginService', () => {
    expect(loginService).toBeDefined();
  });

  describe('login', () => {
    it('should be return a access token successfully', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await loginService.login(input);

      expect(result).toMatchObject({
        access_token: expect.any(String),
      });
    });
  });

  it('should be reject when the user is not found', async () => {
    const input = {
      email: 'invalid@example.com',
      password: 'password123',
    };

    await expect(loginService.login(input)).rejects.toThrow('Unauthorized');
  });

  it('should be reject when the password is incorrect', async () => {
    const input = {
      email: 'test@example.com',
      password: 'wrongPassword',
    };

    await expect(loginService.login(input)).rejects.toThrow('Unauthorized');
  });
});
