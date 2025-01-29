import { Module, Provider } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlInMemoryRepository } from './repository/url-in-memory.repository';
import { UrlController } from './url.controller';

const services: Provider[] = [
  UrlService,
  {
    provide: 'URL_REPOSITORY',
    useValue: new UrlInMemoryRepository(),
  },
];

@Module({
  imports: [],
  controllers: [UrlController],
  providers: services,
  exports: services,
})
export class UrlModule {}
