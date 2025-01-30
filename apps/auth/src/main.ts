import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { documentFactory } from '../../@share/doc/document.factory';
import { userDocConfig } from './doc/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MAIN');

  const port = Number(process.env.AUTH_PORT || 3001);

  const app = await NestFactory.create(AuthModule);

  documentFactory(app, [userDocConfig]);

  await app.listen(port, () => {
    logger.verbose('App running on port ' + port);
    logger.verbose('Swagger API docs at http://localhost:' + port + '/api');
  });
}
bootstrap();
