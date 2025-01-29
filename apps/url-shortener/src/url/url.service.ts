import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Url } from './domain/url.entity';
import { UrlRepositoryInterface } from './repository/url.repository.interface';
import { DataAlreadySavedException } from '../../../@share/exceptions/data-already-saved.exception';
import {
  UrlShortenerInputDTO,
  UrlShortenerOutputDTO,
} from './dto/url-shortener.dto';
import { NotFoundException } from '../../../@share/exceptions/not-found.exception';
import { ClickingInputDTO, ClickingOutputDTO } from './dto/clicking.dto';
import { Sort } from '../../../@share/enums/sort.enum';
import { ListInputDTO, ListOutputDTO } from './dto/list.dto';
import { getNextPage, getPrevPage } from '../../../@share/utils/getPagination';

@Injectable()
export class UrlService {
  constructor(
    @Inject('URL_REPOSITORY')
    private readonly repository: UrlRepositoryInterface,
  ) {}

  public async urlShortener(
    input: UrlShortenerInputDTO,
    transaction?: Transaction,
  ): Promise<UrlShortenerOutputDTO> {
    const { url: originalUrl, serverUrl, userId } = input;

    const shortUrl = Url.generateShortUrl(originalUrl, serverUrl);

    const [existingOriginUrl, existingShortUrl] = await Promise.all([
      this.repository.findOneByOriginalUrl(originalUrl, transaction),
      this.repository.findOneByShortUrl(shortUrl, transaction),
    ]);

    if (existingOriginUrl || existingShortUrl) {
      throw new DataAlreadySavedException('Url already shortened');
    }

    const urlEntity = Url.create({ originalUrl, userId, shortUrl });

    await this.repository.create(urlEntity, transaction);

    return {
      id: urlEntity.getId(),
      shortUrl: urlEntity.getShortUrl(),
      createdAt: urlEntity.getCreatedAt(),
    };
  }

  public async clicking(
    input: ClickingInputDTO,
    transaction?: Transaction,
  ): Promise<ClickingOutputDTO> {
    const { shortUrl, userId } = input;

    const url = await this.repository.findOneByShortUrl(shortUrl, transaction);

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    url.click(userId);

    await this.repository.saveClicks(url, transaction);

    return {
      id: url.getId(),
      originalUrl: url.getOriginalUrl(),
      createdAt: url.getCreatedAt(),
    };
  }

  public async list(input: ListInputDTO): Promise<ListOutputDTO> {
    const { userId, baseUrl } = input;

    const { count, page, rows, sort, totalPages, pageSize } =
      await this.repository.list({
        userId: userId,
        page: input?.page,
        pageSize: input?.pageSize,
        sort: input?.sort || Sort.DESC,
        countOfClick: !!userId,
      });

    const data = rows?.map((row) => {
      return {
        id: row.getId(),
        originalUrl: row.getOriginalUrl(),
        shortUrl: row.getShortUrl(),
        clickCount: userId ? row.getClickCount() : null,
        createdAt: row.getCreatedAt(),
        updatedAt: row.getUpdatedAt(),
        _infoPage: `${baseUrl}/${row.getId()}`,
        _clicksPage: `${baseUrl}/${row.getId()}/clicks`,
      };
    });

    return {
      count,
      totalPages,
      page,
      pageSize,
      sort,
      _nextPage: getNextPage({ page, totalPages, baseUrl, pageSize }),
      _prevPage: getPrevPage({ page, baseUrl, pageSize }),
      data,
    };
  }
}
