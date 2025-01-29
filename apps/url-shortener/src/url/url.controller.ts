import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { UrlShortenerInputDTO } from './dto/url-shortener.dto';
import { getBaseUrl } from '../utils/getBaseUrl';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { Sequelize } from 'sequelize-typescript';

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
}
