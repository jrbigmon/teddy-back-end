import { Injectable } from '@nestjs/common';
import { UrlRepositoryInterface } from './url.repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import UrlModel from '../model/urls.model';
import { Sequelize, Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';
import ClickModel from '../model/clicks.model';
import { Sort } from '../../../../@share/enums/sort.enum';
import { getPagination } from '../../../../@share/utils/getPagination';

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

  public async create(input: Url, transaction?: Transaction): Promise<void> {
    await this.model.create(
      {
        id: input.getId(),
        originalUrl: input.getOriginalUrl(),
        shortUrl: input.getShortUrl(),
        userId: input.getUserId(),
        createdAt: input.getCreatedAt(),
        updatedAt: input.getUpdatedAt(),
      },
      { transaction },
    );
  }

  public async update(input: Url, transaction?: Transaction): Promise<void> {
    await this.model.update(
      {
        originalUrl: input.getOriginalUrl(),
        shortUrl: input.getShortUrl(),
      },
      {
        where: { id: input.getId() },
        transaction,
      },
    );
  }

  public async saveClicks(url: Url, transaction?: Transaction): Promise<void> {
    const clicks = url.getClicks();

    if (!clicks?.length) return;

    await Promise.all(
      clicks.map((click) => {
        return this.clickModel.create(
          {
            id: click.getId(),
            urlId: click.getUrlId(),
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

  public async list(input: {
    userId: number;
    page?: number;
    pageSize?: number;
    sort?: Sort;
    countOfClick?: boolean;
  }): Promise<{
    count: number;
    totalPages: number;
    currentPage: number;
    sort: Sort;
    rows: Url[];
  }> {
    const {
      userId,
      page = 1,
      pageSize = 10,
      sort = Sort.DESC,
      countOfClick = true,
    } = input;

    const whereFilter = userId ? { userId } : {};

    const { rows, count } = await this.model.findAndCountAll({
      where: whereFilter,
      attributes: [
        'id',
        'originalUrl',
        'shortUrl',
        'userId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        countOfClick && [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM "clicks" WHERE "clicks"."url_id" = "UrlModel"."id")',
          ),
          'clickCount',
        ],
      ],
      limit: pageSize,
      offset: getPagination({ page, pageSize }),
      order: [['createdAt', sort]],
    });

    return {
      count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      sort,
      rows: rows.map((row) => {
        const urlJSON = row.toJSON();

        const url = new Url({ ...urlJSON, clicks: [] });

        const clickCount = urlJSON['clickCount'];

        if (clickCount) {
          url.setClickCount(clickCount);
        }

        return url;
      }),
    };
  }
}
