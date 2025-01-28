import { comparePassword, encryptPassword } from './crypto';

describe('crypto', () => {
  it('should be encrypt the password and compare return true', async () => {
    const password = 'password123';

    const encryptedPassword = await encryptPassword(password);
    const isPasswordCorrect = await comparePassword(
      password,
      encryptedPassword,
    );

    expect(isPasswordCorrect).toBeTruthy();
    expect(encryptedPassword).not.toBe(password);
  });

  it('should be encrypt the password and compare return false', async () => {
    const password = 'password123';
    const wrongPassword = 'wrongPassword123';

    const encryptedPassword = await encryptPassword(password);
    const isPasswordCorrect = await comparePassword(
      wrongPassword,
      encryptedPassword,
    );

    expect(isPasswordCorrect).toBeFalsy();
    expect(encryptedPassword).not.toBe(password);
  });
});
