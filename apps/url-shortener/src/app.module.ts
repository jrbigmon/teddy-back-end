import { Module } from '@nestjs/common';
import { UrlModule } from './url/url.module';
import { QueueModule } from './queues/queues.module';

@Module({
  imports: [UrlModule, QueueModule],
})
export class AppModule {}
