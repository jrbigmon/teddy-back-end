import { User, InputCreate } from './users.entity';

describe('User entity', () => {
  it('should be create a new valid user', () => {
    const payload: InputCreate = {
      name: 'test',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = User.create(payload);

    expect(user).toMatchObject({
      id: expect.any(String),
      ...payload,
    });
  });

  it('should be throw a error when the email is not provided', () => {
    const payload: InputCreate = {
      name: 'test',
      password: 'password123',
      email: null,
    };

    expect(() => User.create(payload)).toThrow('Email is required');
  });

  it('should be throw a error when the password is not provided', () => {
    const payload: InputCreate = {
      name: 'test',
      email: 'test@example.com',
      password: null,
    };

    expect(() => User.create(payload)).toThrow('Password is required');
  });

  it('should be throw a error when the name is not provided', () => {
    const payload: InputCreate = {
      name: null,
      email: 'test@example.com',
      password: 'password123',
    };

    expect(() => User.create(payload)).toThrow('Name is required');
  });
});
