import { CreateUserInputDTO } from './dto/create-user.dto';
import { UserInMemoryRepository } from './repository/users-in-memory.repository';
import { UserRepositoryInterface } from './repository/users.repository.interface';
import { UserService } from './users.service';

describe('UserService unit tests', () => {
  let userService: UserService = null;
  let repository: UserRepositoryInterface = null;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    userService = new UserService(repository);
  });

  it('should be create a new user and encrypt the password', async () => {
    const input: CreateUserInputDTO = {
      name: 'test',
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await userService.create(input);
    const userInTheDatabase = await repository.get(result.id);

    expect(result.name).toBe('test');
    expect(result.createdAt).toBeDefined();
    expect(userInTheDatabase.getPassword()).not.toBe(input.password);
    expect(userInTheDatabase).toMatchObject({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      password: expect.any(String),
    });
  });
});
