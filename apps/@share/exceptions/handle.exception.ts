import { HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { InvalidDataException } from './invalid-data.expcetion';
import { UnauthorizedException } from './unauthorized.exception';
import { DataAlreadySavedException } from './data-already-saved.exception';
import { NotFoundException } from './not-found.exception';

export function handleException(error: Error, response: Response): Response {
  const logger = new Logger('HandleException');

  logger.error(error.message);

  if (error.name === InvalidDataException.name) {
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
      statusCode: HttpStatus.BAD_REQUEST,
      name: error.name,
    });
  }

  if (error.name === UnauthorizedException.name) {
    return response.status(HttpStatus.UNAUTHORIZED).json({
      message: error.message,
      statusCode: HttpStatus.UNAUTHORIZED,
      name: error.name,
    });
  }

  if (error.name === DataAlreadySavedException.name) {
    return response.status(HttpStatus.CONFLICT).json({
      message: error.message,
      statusCode: HttpStatus.CONFLICT,
      name: error.name,
    });
  }

  if (error.name === NotFoundException.name) {
    return response.status(HttpStatus.NOT_FOUND).json({
      message: error.message,
      statusCode: HttpStatus.NOT_FOUND,
      name: error.name,
    });
  }

  return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    name: error.name,
  });
}
