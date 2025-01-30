import {
  Body,
  Controller,
  Delete,
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
import {
  UrlShortenerInputDTO,
  UrlShortenerOutputDTO,
} from './dto/url-shortener.dto';
import { getBaseUrl } from '../utils/getBaseUrl';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { Sequelize } from 'sequelize-typescript';
import { Sort } from '../../../@share/enums/sort.enum';
import { AuthGuard } from '../../../@share/auth-guard/auth-guard';
import { getDecodedUser } from '../../../@share/utils/getDecodedUser';
import { DecodeJwt } from '../../../@share/auth-guard/decode-jwt';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UrlUpdateInputDTO, UrlUpdateOutputDTO } from './dto/url-update.dto';
import { UrlListInputDTO, UrlListOutputDTO } from './dto/url-list.dto';
import { UrlGetOutputDTO } from './dto/url-get-dto';

@ApiTags('Urls')
@Controller('api/urls')
export class UrlController {
  constructor(
    private readonly service: UrlService,
    private readonly sequelize: Sequelize,
  ) {}

  @Post('shorten')
  @ApiCreatedResponse({
    description: 'New URL has been shortened.',
    type: UrlShortenerOutputDTO,
  })
  @ApiBearerAuth()
  @UseGuards(DecodeJwt)
  public async urlShortener(
    @Body() body: UrlShortenerInputDTO,
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
  @ApiParam({
    name: 'id',
    description: 'ID of the URL to be updated.',
    type: String,
  })
  @ApiOkResponse({
    description: 'New URL has been updated.',
    type: UrlUpdateOutputDTO,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, DecodeJwt)
  public async update(
    @Param('id') id: string,
    @Body() body: UrlUpdateInputDTO,
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

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the URL to be deleted.',
    type: String,
  })
  @ApiNoContentResponse({
    description: 'URL has been deleted.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, DecodeJwt)
  public async delete(
    @Param('id') id: string,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.delete(
        {
          id,
          userId: userDecoded?.id ?? null,
        },
        transaction,
      );

      await transaction.commit();

      return response.status(HttpStatus.NO_CONTENT).json(result);
    } catch (error) {
      await transaction.rollback();

      return handleException(error, response);
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'A list of urls has been returned',
    type: UrlListOutputDTO,
  })
  @ApiBearerAuth()
  @UseGuards(DecodeJwt)
  public async list(
    @Query() query: UrlListInputDTO,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    const { page, pageSize, sort } = query;
    try {
      const userDecoded = getDecodedUser(request);

      const result = await this.service.list({
        userId: userDecoded?.id ?? null,
        sort,
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
  @ApiParam({
    name: 'id',
    description: 'ID of the URL to be found.',
    type: String,
  })
  @ApiOkResponse({
    description: 'A URL has been returned',
    type: UrlGetOutputDTO,
  })
  @ApiBearerAuth()
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
