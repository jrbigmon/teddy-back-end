import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { UrlShortenerInputDTO } from './dto/url-shortener.dto';
import { getBaseUrl } from '../utils/getBaseUrl';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { Sequelize } from 'sequelize-typescript';
import { Sort } from '../../../@share/enums/sort.enum';
import { AuthGuard } from '../../../@share/auth-guard/auth-guard';
import { getDecodedUser } from '../../../@share/utils/getDecodedUser';
import { DecodeJwt } from '../../../@share/auth-guard/decode-jwt';

@Controller('api/urls')
export class UrlController {
  constructor(
    private readonly service: UrlService,
    private readonly sequelize: Sequelize,
  ) {}

  @Post('shorten')
  @UseGuards(DecodeJwt)
  public async urlShortener(
    @Body() body: Pick<UrlShortenerInputDTO, 'url'>,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.urlShortener(
        {
          url: body?.url,
          serverUrl: getBaseUrl(request),
          userId: userDecoded?.id ?? null,
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

  @Put(':id')
  @UseGuards(AuthGuard, DecodeJwt)
  public async update(
    @Param('id') id: string,
    @Body() body: Pick<UrlShortenerInputDTO, 'url'>,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.update(
        {
          id,
          url: body?.url,
          userId: userDecoded?.id ?? null,
          serverUrl: getBaseUrl(request),
        },
        transaction,
      );

      await transaction.commit();

      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      await transaction.rollback();

      return handleException(error, response);
    }
  }

  @Get()
  @UseGuards(DecodeJwt)
  public async list(
    @Query() query: { page?: number; pageSize?: number; sort?: Sort },
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const { page, pageSize } = query;
    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.list({
        userId: userDecoded?.id ?? null,
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
  @UseGuards(DecodeJwt)
  public async get(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.get({
        id,
        userId: userDecoded?.id ?? null,
      });

      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return handleException(error, response);
    }
  }
}
