import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvalidDataException } from './invalid-data.expcetion';
import { UnauthorizedException } from './unauthorized.expcetion';
import { DataAlreadySavedException } from './data-already-saved.exception';

export function handleException(error: Error, response: Response): Response {
  console.error(error);

  if (error.name === InvalidDataException.name) {
    return response
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: error.message });
  }

  if (error.name === UnauthorizedException.name) {
    return response
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: error.message });
  }

  if (error.name === DataAlreadySavedException.name) {
    return response
      .status(HttpStatus.CONFLICT)
      .json({ message: error.message });
  }

  return response
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal Server Error' });
}
