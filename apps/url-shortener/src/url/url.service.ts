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
import { GetInputDTO, GetOutputDTO } from './dto/get-dto';
import { UrlUpdateInputDTO, UrlUpdateOutputDTO } from './dto/url-update.dto';

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

    await this.checkIfAlreadyExist({ originalUrl, shortUrl });

    const urlEntity = Url.create({ originalUrl, userId, shortUrl });

    await this.repository.create(urlEntity, transaction);

    return {
      id: urlEntity.getId(),
      shortUrl: urlEntity.getShortUrl(),
      createdAt: urlEntity.getCreatedAt(),
    };
  }

  public async update(
    input: UrlUpdateInputDTO,
    transaction?: Transaction,
  ): Promise<UrlUpdateOutputDTO> {
    const { id, url, userId, serverUrl } = input;

    const urlEntity = await this.repository.getOne({
      id,
      userId,
    });

    if (!urlEntity) {
      throw new NotFoundException('Url not found');
    }

    urlEntity.setShortUrl(Url.generateShortUrl(url, serverUrl));
    urlEntity.setOriginalUrl(url);

    await this.checkIfAlreadyExist({
      id,
      originalUrl: urlEntity.getOriginalUrl(),
      shortUrl: urlEntity.getShortUrl(),
    });

    await this.repository.update(urlEntity, transaction);

    return {
      id: urlEntity.getId(),
      shortUrl: urlEntity.getShortUrl(),
      createdAt: urlEntity.getCreatedAt(),
      updatedAt: urlEntity.getUpdatedAt(),
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

  public async get(
    input: GetInputDTO,
    transaction?: Transaction,
  ): Promise<GetOutputDTO> {
    const { id, userId } = input;

    const url = await this.repository.get(id, transaction);

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    const canSeeClickCount = userId && userId === url.getUserId();

    return {
      id: url.getId(),
      originalUrl: url.getOriginalUrl(),
      shortUrl: url.getShortUrl(),
      clickCount: canSeeClickCount ? url.getClickCount() : null,
      createdAt: url.getCreatedAt(),
      updatedAt: url.getUpdatedAt(),
    };
  }

  private async checkIfAlreadyExist(
    {
      originalUrl,
      shortUrl,
      id,
    }: { originalUrl: string; shortUrl: string; id?: string },
    transaction?: Transaction,
  ) {
    const [existingOriginUrl, existingShortUrl] = await Promise.all([
      this.repository.findOneByOriginalUrl(originalUrl, transaction),
      this.repository.findOneByShortUrl(shortUrl, transaction),
    ]);

    if (existingOriginUrl && existingOriginUrl.getId() !== id) {
      throw new DataAlreadySavedException('Url already shortened');
    }

    if (existingShortUrl && existingShortUrl.getId() !== id) {
      throw new DataAlreadySavedException('Url already shortened');
    }
  }
}
