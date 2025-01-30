const argon2 = require('argon2');
import { InvalidDataException } from '../../../@share/exceptions/invalid-data.expcetion';

export async function encryptPassword(password: string): Promise<string> {
  const salt = 10;

  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error(error);
    throw new InvalidDataException('Incorrect password data to encrypt');
  }
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return (await argon2.verify(hash, password)) as Promise<boolean>;
  } catch (error) {
    throw new InvalidDataException('Incorrect password on compare');
  }
}
