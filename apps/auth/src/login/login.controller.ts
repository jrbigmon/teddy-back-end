import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginInputDTO, LoginOutputDTO } from './dto/login.dto';
import { LoginService } from './login.service';
import { Response } from 'express';
import { handleException } from '../../../@share/exceptions/handle.exception';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Login')
@Controller('api/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User has been successfully logged in.',
    type: LoginOutputDTO,
  })
  async login(@Body() input: LoginInputDTO, @Res() response: Response) {
    try {
      const result = await this.loginService.login(input);

      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return handleException(error, response);
    }
  }
}
