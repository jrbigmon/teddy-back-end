import { hash, compare } from 'bcrypt';
import { InvalidDataException } from '../../../@share/exceptions/InvalidDataException';

export async function encryptPassword(password: string): Promise<string> {
  const salt = 10;

  try {
    return hash(password, salt);
  } catch (error) {
    console.error(error);
    throw new InvalidDataException('Incorrect password data to encrypt');
  }
}

export function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return compare(password, hash);
  } catch (error) {
    throw new InvalidDataException('Incorrect password on compare');
  }
}
