import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { documentFactory } from '../../@share/doc/document.factory';
import { userDocConfig } from './doc/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  documentFactory(app, [userDocConfig]);

  await app.listen(3001);
}
bootstrap();
