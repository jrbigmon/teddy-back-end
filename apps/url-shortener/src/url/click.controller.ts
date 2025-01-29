import { Sequelize } from 'sequelize-typescript';
import { UrlService } from './url.service';
import { Controller, Get, Param, Req, Res, HttpStatus } from '@nestjs/common';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { getBaseUrl } from '../utils/getBaseUrl';
import { Request, Response } from 'express';

@Controller()
export class ClickController {
  constructor(
    private readonly service: UrlService,
    private readonly sequelize: Sequelize,
  ) {}

  @Get(':id')
  public async clicking(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const { userId } = { userId: '123' };

      const result = await this.service.clicking(
        {
          shortUrl: `${getBaseUrl(request)}/${id}`,
          userId,
        },
        transaction,
      );

      await transaction.commit();

      return response.status(HttpStatus.OK).redirect(result.originalUrl);
    } catch (error) {
      await transaction.rollback();

      return handleException(error, response);
    }
  }
}
