import { User, InputCreate } from './users.entity';

describe('User entity', () => {
  it('should be create a new valid user', () => {
    const payload: InputCreate = {
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
      password: 'password123',
      email: null,
    };

    expect(() => User.create(payload)).toThrow('Email is required');
  });

  it('should be throw a error when the password is not provided', () => {
    const payload: InputCreate = {
      email: 'test@example.com',
      password: null,
    };

    expect(() => User.create(payload)).toThrow('Password is required');
  });
});
