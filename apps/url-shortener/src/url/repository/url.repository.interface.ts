import { Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';
import { Sort } from '../../../../@share/enums/sort.enum';

export interface ListInput {
  userId: string;
  page?: number;
  pageSize?: number;
  sort?: Sort;
  countOfClick?: boolean;
}

export interface ListOutput {
  count: number;
  totalPages: number;
  page: number;
  pageSize: number;
  sort: Sort;
  rows: Url[];
}

export interface GetOneInput {
  id: string;
  originalUrl: string;
  shortUrl: string;
  userId: string;
}

export interface UrlRepositoryInterface {
  findOneByShortUrl(shortUrl: string, transaction?: Transaction): Promise<Url>;
  findOneByOriginalUrl(
    originalUrl: string,
    transaction?: Transaction,
  ): Promise<Url>;
  create(url: Url, transaction?: Transaction): Promise<void>;
  update(url: Url, transaction?: Transaction): Promise<void>;
  get(id: string, transaction?: Transaction): Promise<Url>;
  saveClicks(url: Url, transaction?: Transaction): Promise<void>;
  list(input: ListInput): Promise<ListOutput>;
  getOne(input: Partial<GetOneInput>): Promise<Url>;
}
