import { DocumentBuilder } from '@nestjs/swagger';

const urlShortenerDocConfig = new DocumentBuilder()
  .setTitle('Url Shortener')
  .setDescription('Url Shortener API documentation')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();

export { urlShortenerDocConfig };
