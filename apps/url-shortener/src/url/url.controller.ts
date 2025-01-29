import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Request, Response } from 'express';
import { UrlShortenerInputDTO } from './dto/url-shortener.dto';
import { getBaseUrl } from '../utils/getBaseUrl';
import { handleException } from '../../../@share/exceptions/handle.exception';

@Controller('api/urls')
export class UrlController {
  constructor(private readonly service: UrlService) {}

  @Post('shorten')
  public async urlShortener(
    @Body() body: Pick<UrlShortenerInputDTO, 'url'>,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    try {
      const result = await this.service.urlShortener({
        url: body?.url,
        serverUrl: getBaseUrl(request),
      });

      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return handleException(error, response);
    }
  }
}
