import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserInputDTO, CreateUserOutputDTO } from './dto/create-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { Response } from 'express';

import { handleException } from '../../../@share/exceptions/handle.exception';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly sequelize: Sequelize,
  ) {}

  @Post()
  public async create(
    @Body() body: CreateUserInputDTO,
    @Res() response: Response,
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      const result = await this.service.create(body, transaction);

      await transaction.commit();

      return response.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      await transaction.rollback();

      return handleException(error, response);
    }
  }
}
