import { Sequelize } from 'sequelize-typescript';
import { UrlService } from './url.service';
import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { getBaseUrl } from '../utils/getBaseUrl';
import { Request, Response } from 'express';
import { DecodeJwt } from '../../../@share/auth-guard/decode-jwt';
import { getDecodedUser } from '../../../@share/utils/getDecodedUser';
import { ApiBearerAuth, ApiPermanentRedirectResponse } from '@nestjs/swagger';

@Controller()
export class ClickController {
  constructor(
    private readonly service: UrlService,
    private readonly sequelize: Sequelize,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @ApiPermanentRedirectResponse({
    description: 'Redirect to the original URL.',
  })
  @UseGuards(DecodeJwt)
  public async clicking(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.clicking(
        {
          shortUrl: `${getBaseUrl(request)}/${id}`,
          userId: userDecoded?.id ?? null,
        },
        transaction,
      );

      await transaction.commit();

      return response
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect(result.originalUrl);
    } catch (error) {
      await transaction.rollback();

      return handleException(error, response);
    }
  }
}
