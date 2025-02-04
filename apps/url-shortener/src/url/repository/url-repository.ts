import { Injectable } from '@nestjs/common';
import {
  GetOneInput,
  ListInput,
  ListOutput,
  UrlRepositoryInterface,
} from './url.repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import UrlModel from '../model/urls.model';
import { FindAttributeOptions, Sequelize, Transaction } from 'sequelize';
import { Url } from '../domain/url.entity';
import ClickModel from '../model/clicks.model';
import { Sort } from '../../../../@share/enums/sort.enum';
import { getPagination } from '../../../../@share/utils/getPagination';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '../../../../@share/constants/pagination';

@Injectable()
export class UrlRepository implements UrlRepositoryInterface {
  constructor(
    @InjectModel(UrlModel)
    private readonly model: typeof UrlModel,
    @InjectModel(ClickModel)
    private readonly clickModel: typeof ClickModel,
  ) {}

  public async save(input: Url, transaction?: Transaction): Promise<void> {
    const exists = await this.get(input.getId(), transaction);

    const urlToSave: Partial<UrlModel> = {
      id: input.getId(),
      originalUrl: input.getOriginalUrl(),
      shortUrl: input.getShortUrl(),
      userId: input.getUserId(),
      createdAt: input.getCreatedAt(),
      updatedAt: input.getUpdatedAt(),
      deletedAt: input.getDeletedAt(),
    };

    if (exists) {
      await this.model.update(urlToSave, {
        where: {
          id: input.getId(),
        },
      });
    } else {
      await this.model.create(urlToSave, { transaction });
    }

    const clicks = input.getClicks();

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
      attributes: [
        'id',
        'originalUrl',
        'shortUrl',
        'userId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM "clicks" WHERE "clicks"."url_id" = "UrlModel"."id")',
          ),
          'clickCount',
        ],
      ],
    });

    if (!url) return null;

    const urlJSON = url.toJSON();

    const urlEntity = new Url({ ...urlJSON, clicks: [] });

    const clickCount = urlJSON['clickCount'];

    if (clickCount) {
      urlEntity.setClickCount(+clickCount);
    }

    return urlEntity;
  }

  public async list(input: ListInput): Promise<ListOutput> {
    const {
      userId,
      page = DEFAULT_PAGE,
      pageSize = DEFAULT_PAGE_SIZE,
      sort = Sort.DESC,
      countOfClick = true,
    } = input;

    const whereFilter = userId ? { userId } : {};

    const defaultAttributes: FindAttributeOptions = [
      'id',
      'originalUrl',
      'shortUrl',
      'userId',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ];

    if (countOfClick) {
      defaultAttributes.push([
        Sequelize.literal(
          '(SELECT COUNT(*) FROM "clicks" WHERE "clicks"."url_id" = "UrlModel"."id")',
        ),
        'clickCount',
      ]);
    }

    const { rows, count } = await this.model.findAndCountAll({
      where: whereFilter,
      attributes: defaultAttributes,
      limit: pageSize,
      offset: getPagination({ page, pageSize }),
      order: [['createdAt', sort]],
    });

    return {
      count,
      totalPages: Math.ceil(count / pageSize),
      page,
      pageSize,
      sort,
      rows: rows.map((row) => {
        const urlJSON = row.toJSON();

        const url = new Url({ ...urlJSON, clicks: [] });

        const clickCount = urlJSON['clickCount'];

        if (clickCount) {
          url.setClickCount(+clickCount);
        }

        return url;
      }),
    };
  }

  public async getOne(input: Partial<GetOneInput>): Promise<Url> {
    const url = await this.model.findOne({
      where: input,
    });

    if (!url) return null;

    return new Url({ ...url.toJSON(), clicks: [] });
  }
}
