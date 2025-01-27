import { randomUUID } from 'node:crypto';

export function genUUID(): string {
  return randomUUID();
}
