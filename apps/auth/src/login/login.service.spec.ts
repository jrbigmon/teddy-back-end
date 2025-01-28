import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { LoginService } from './login.service';
import { randomUUID } from 'node:crypto';
import { User } from '../users/domain/users.entity';
import { encryptPassword } from '../utils/crypto';

describe('LoginService unit tests', () => {
  let loginService: LoginService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jest.clearAllMocks();

    jwtService = {
      signAsync: jest.fn().mockResolvedValue(randomUUID()),
    } as unknown as JwtService;

    userService = {
      getByEmail: jest.fn().mockResolvedValue(
        new User({
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
          password: await encryptPassword('123456'),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
    } as unknown as UserService;

    loginService = new LoginService(userService, jwtService);
  });

  describe('login', () => {
    it('should be return a access token successfully', async () => {
      const input = {
        email: 'test@example.com',
        password: '123456',
      };

      const result = await loginService.login(input);

      expect(result).toMatchObject({
        access_token: expect.any(String),
      });
    });

    it('should be reject when the user is not found', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValueOnce(null);

      const input = {
        email: 'test@example.com',
        password: '123456',
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
});
