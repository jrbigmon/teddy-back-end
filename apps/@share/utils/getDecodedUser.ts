import { Request } from 'express';

export function getDecodedUser(request: Request) {
  return request['decodedData'];
}
