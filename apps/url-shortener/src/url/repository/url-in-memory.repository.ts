import { Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';
import {
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

  public async findOneByShortUrl(
    shortUrl: string,
    _?: Transaction,
  ): Promise<Url> {
    return this.urls.find((url) => url.getShortUrl() === shortUrl);
  }

  public async findOneByOriginalUrl(
    originalUrl: string,
    _?: Transaction,
  ): Promise<Url> {
    return this.urls.find((url) => url.getOriginalUrl() === originalUrl);
  }

  public async create(url: Url, _?: Transaction): Promise<void> {
    this.urls.push(url);
  }

  public async update(url: Url, _?: Transaction): Promise<void> {
    const urlIndex = this.urls.findIndex((url) => url.getId() === url.getId());

    if (urlIndex !== -1) {
      this.urls[urlIndex] = url;
      return;
    }
  }

  public async saveClicks(url: Url, _?: Transaction): Promise<void> {
    const urlIndex = this.urls.findIndex((url) => url.getId() === url.getId());

    if (urlIndex !== -1) {
      this.urls[urlIndex] = url;
      return;
    }
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
}
