import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { documentFactory } from '../../@share/doc/document.factory';
import { urlShortenerDocConfig } from './doc/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  documentFactory(app, [urlShortenerDocConfig]);

  await app.listen(3000);
}
bootstrap();
