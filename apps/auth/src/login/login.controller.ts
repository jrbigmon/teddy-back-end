import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginInputDTO } from './dto/login.dto';
import { LoginService } from './login.service';
import { Response } from 'express';
import { handleException } from '../../../@share/exceptions/handle.exception';

@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() input: LoginInputDTO, @Res() response: Response) {
    try {
      const result = await this.loginService.login(input);

      return response.status(HttpStatus.OK).json(result);
    } catch (error) {
      return handleException(error, response);
    }
  }
}
