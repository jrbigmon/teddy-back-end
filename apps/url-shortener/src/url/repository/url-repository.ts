import { Injectable } from '@nestjs/common';
import { UrlRepositoryInterface } from './url.repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import UrlModel from '../model/urls.model';
import { Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';
import ClickModel from '../model/clicks.model';

@Injectable()
export class UrlRepository implements UrlRepositoryInterface {
  constructor(
    @InjectModel(UrlModel)
    private readonly model: typeof UrlModel,
    @InjectModel(ClickModel)
    private readonly clickModel: typeof ClickModel,
  ) {}

  public async findOneByShortUrl(
    shortUrl: string,
    transaction?: Transaction,
  ): Promise<Url> {
    if (!shortUrl) return null;

    const url = await this.model.findOne({
      where: { shortUrl },
      transaction,
    });

    if (!url) return null;

    return new Url({ ...url.toJSON(), clicks: [] });
  }

  public async findOneByOriginalUrl(
    originalUrl: string,
    transaction?: Transaction,
  ): Promise<Url> {
    if (!originalUrl) return null;

    const url = await this.model.findOne({
      where: { originalUrl },
      transaction,
    });

    if (!url) return null;

    return new Url({ ...url.toJSON(), clicks: [] });
  }

  public async create(url: Url, transaction?: Transaction): Promise<void> {
    await this.model.create(
      {
        originalUrl: url.getOriginalUrl(),
        shortUrl: url.getShortUrl(),
        userId: url.getUserId(),
        createdAt: url.getCreatedAt(),
        updatedAt: url.getUpdatedAt(),
      },
      { transaction },
    );
  }

  public async update(url: Url, transaction?: Transaction): Promise<void> {
    await this.model.update(
      {
        originalUrl: url.getOriginalUrl(),
        shortUrl: url.getShortUrl(),
      },
      {
        where: { id: url.getId() },
        transaction,
      },
    );
  }

  public async addClicks(url: Url, transaction?: Transaction): Promise<void> {
    const clicks = url.getClicks();

    if (!clicks?.length) return;

    await Promise.all(
      clicks.map((click) => {
        return this.clickModel.create(
          {
            urlId: url.getId(),
            userId: click.getUserId(),
            createdAt: click.getCreatedAt(),
            updatedAt: click.getUpdatedAt(),
          },
          { transaction },
        );
      }),
    );
  }

  public async get(id: string, transaction?: Transaction): Promise<Url> {
    if (!id) return null;

    const url = await this.model.findByPk(id, {
      transaction,
    });

    return new Url({ ...url.toJSON(), clicks: [] });
  }
}
