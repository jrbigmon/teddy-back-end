import { Module, Provider } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { DatabaseModule, modelsModule } from '../database/database.module';
import { UrlRepository } from './repository/url-repository';
import { ClickController } from './click.controller';
import { AuthGuardModule } from '../../../@share/auth-guard/auth-guard.module';
import { UserModule } from '../users/users.module';

const services: Provider[] = [
  UrlService,
  UrlRepository,
  {
    provide: 'URL_REPOSITORY',
    useClass: UrlRepository,
  },
];

@Module({
  imports: [AuthGuardModule, DatabaseModule, UserModule, modelsModule],
  controllers: [UrlController, ClickController],
  providers: services,
  exports: services,
})
export class UrlModule {}
