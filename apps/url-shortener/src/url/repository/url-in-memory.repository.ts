import { Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';
import {
  GetOneInput,
  ListInput,
  ListOutput,
  UrlRepositoryInterface,
} from './url.repository.interface';
import { Sort } from '../../../../@share/enums/sort.enum';

export class UrlInMemoryRepository implements UrlRepositoryInterface {
  private urls: Url[] = [];

  public async get(id: string, _?: Transaction): Promise<Url> {
    return this.urls.find((url) => url.getId() === id);
  }

  public async save(url: Url, _?: Transaction): Promise<void> {
    const urlIndex = this.urls.findIndex((url) => url.getId() === url.getId());

    if (urlIndex !== -1) {
      this.urls[urlIndex] = url;
      return;
    }

    this.urls.push(url);
  }

  public async list(_input: ListInput): Promise<ListOutput> {
    return {
      rows: this.urls,
      count: this.urls.length,
      totalPages: 1,
      page: 1,
      sort: Sort.DESC,
      pageSize: 1,
    };
  }

  async getOne(input: Partial<GetOneInput>): Promise<Url> {
    const { id, originalUrl, shortUrl, userId } = input;

    if (id) {
      return this.get(id);
    }

    if (originalUrl) {
      return this.urls.find((url) => url.getOriginalUrl() === originalUrl);
    }

    if (shortUrl) {
      return this.urls.find((url) => url.getShortUrl() === shortUrl);
    }

    if (userId) {
      return this.urls.find((url) => url.getUserId() === userId);
    }

    return null;
  }
}
