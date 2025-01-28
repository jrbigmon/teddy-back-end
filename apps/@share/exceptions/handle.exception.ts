import { Response } from 'express';

export function handleException(error: Error, response: Response): Response {
  console.error(error);

  if (error.name === 'InvalidDataException') {
    return response.status(400).json({ message: error.message });
  }

  return response.status(500).json({ message: 'Internal Server Error' });
}
