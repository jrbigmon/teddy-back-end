import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { documentFactory } from '../../@share/doc/document.factory';
import { urlShortenerDocConfig } from './doc/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const port = Number(process.env.URL_SHORTENER_PORT || 3000);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  documentFactory(app, [urlShortenerDocConfig]);

  await app.listen(3000, '0.0.0.0', () => {
    logger.verbose('App running on port ' + port);
    logger.verbose('Swagger API docs at http://localhost:' + port + '/api');
  });
}
bootstrap();
