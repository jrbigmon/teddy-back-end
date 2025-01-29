import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { UrlShortenerInputDTO } from './dto/url-shortener.dto';
import { getBaseUrl } from '../utils/getBaseUrl';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { Sequelize } from 'sequelize-typescript';
import { Sort } from '../../../@share/enums/sort.enum';

@Controller('api/urls')
export class UrlController {
  constructor(
    private readonly service: UrlService,
    private readonly sequelize: Sequelize,
  ) {}

  @Post('shorten')
  public async urlShortener(
    @Body() body: Pick<UrlShortenerInputDTO, 'url'>,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const result = await this.service.urlShortener(
        {
          url: body?.url,
          serverUrl: getBaseUrl(request),
          userId: null,
        },
        transaction,
      );

      await transaction.commit();

      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      await transaction.rollback();

      return handleException(error, response);
    }
  }

  @Get()
  public async list(
    @Query() query: { page?: number; pageSize?: number; sort?: Sort },
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const { page, pageSize } = query;
    try {
      const result = await this.service.list({
        userId: null,
        page,
        pageSize,
        baseUrl: `${getBaseUrl(request)}/api/urls`,
      });

      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return handleException(error, response);
    }
  }

  @Get(':id')
  public async get(@Param('id') id: string, @Res() response: Response) {
    try {
      const result = await this.service.get({
        id,
        userId: null,
      });

      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return handleException(error, response);
    }
  }
}
