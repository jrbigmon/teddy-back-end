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
import { UrlListInputDTO, UrlListOutputDTO } from './dto/url-list.dto';
import { getNextPage, getPrevPage } from '../../../@share/utils/getPagination';
import { UrlGetInputDTO, UrlGetOutputDTO } from './dto/url-get-dto';
import { UrlUpdateInputDTO, UrlUpdateOutputDTO } from './dto/url-update.dto';
import { UnauthorizedException } from '../../../@share/exceptions/unauthorized.expcetion';
import { UrlDeleteInputDTO, UrlDeleteOutputDTO } from './dto/url-delete.dto';

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

    await this.repository.save(urlEntity, transaction);

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

    const urlEntity = await this.repository.get(id, transaction);

    if (!urlEntity) {
      throw new NotFoundException('Url not found');
    }

    this.isAuthorized(urlEntity, userId);

    urlEntity.setShortUrl(Url.generateShortUrl(url, serverUrl));

    urlEntity.setOriginalUrl(url);

    await this.checkIfAlreadyExist({
      id,
      originalUrl: urlEntity.getOriginalUrl(),
      shortUrl: urlEntity.getShortUrl(),
    });

    await this.repository.save(urlEntity, transaction);

    return {
      id: urlEntity.getId(),
      shortUrl: urlEntity.getShortUrl(),
      createdAt: urlEntity.getCreatedAt(),
      updatedAt: urlEntity.getUpdatedAt(),
    };
  }

  public async delete(
    input: UrlDeleteInputDTO,
    transaction?: Transaction,
  ): Promise<UrlDeleteOutputDTO> {
    const { id, userId } = input;

    const urlEntity = await this.repository.get(id);

    if (!urlEntity) {
      throw new NotFoundException('Url not found');
    }

    this.isAuthorized(urlEntity, userId);

    urlEntity.deleted();

    await this.repository.save(urlEntity, transaction);
  }

  public async clicking(
    input: ClickingInputDTO,
    transaction?: Transaction,
  ): Promise<ClickingOutputDTO> {
    const { shortUrl, userId } = input;

    const url = await this.repository.getOne({ shortUrl }, transaction);

    if (!url) {
      throw new NotFoundException('Url not found');
    }

    url.click(userId);

    await this.repository.save(url, transaction);

    return {
      id: url.getId(),
      originalUrl: url.getOriginalUrl(),
      createdAt: url.getCreatedAt(),
    };
  }

  public async list(input: UrlListInputDTO): Promise<UrlListOutputDTO> {
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
    input: UrlGetInputDTO,
    transaction?: Transaction,
  ): Promise<UrlGetOutputDTO> {
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

  private isAuthorized(url: Url, userId: string) {
    if (url.getUserId() !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
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
      this.repository.getOne({ originalUrl }, transaction),
      this.repository.getOne({ shortUrl }, transaction),
    ]);

    if (existingOriginUrl && existingOriginUrl.getId() !== id) {
      throw new DataAlreadySavedException('Url already shortened');
    }

    if (existingShortUrl && existingShortUrl.getId() !== id) {
      throw new DataAlreadySavedException('Url already shortened');
    }
  }
}
