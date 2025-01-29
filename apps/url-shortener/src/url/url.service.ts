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

  public async list({ userId, page, pageSize }): Promise<any> {
    const data = await this.repository.list({
      userId,
      page,
      pageSize,
      countOfClick: !!userId,
    });

    return data;
  }
}
