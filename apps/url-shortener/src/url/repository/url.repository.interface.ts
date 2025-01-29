import { Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';

export interface UrlRepositoryInterface {
  findOneByShortUrl(shortUrl: string, transaction?: Transaction): Promise<Url>;
  findOneByOriginalUrl(
    originalUrl: string,
    transaction?: Transaction,
  ): Promise<Url>;
  save(url: Url, transaction?: Transaction): Promise<void>;
  get(id: string, transaction?: Transaction): Promise<Url>;
}
