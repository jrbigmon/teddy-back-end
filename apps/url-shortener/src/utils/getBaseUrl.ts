import { Request } from 'express';
import { HTTP_HOST_URL_SHORTENER } from '../../../@share/constants/host';

export function getBaseUrl(request: Request): string {
  return (
    `${request.protocol}://${request.headers['host']}` ||
    HTTP_HOST_URL_SHORTENER
  );
}
