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
  save(url: Url, transaction?: Transaction): Promise<void>;
  get(id: string, transaction?: Transaction): Promise<Url>;
  list(input: ListInput, transaction?: Transaction): Promise<ListOutput>;
  getOne(input: Partial<GetOneInput>, transaction?: Transaction): Promise<Url>;
}
