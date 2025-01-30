import { Module } from '@nestjs/common';
import { UrlModule } from './url/url.module';
import { BullModule } from '@nestjs/bull';
import { USERS_QUEUE } from '../../@share/constants/redis.queues';
import { QueueModule } from './queues/queues.module';

@Module({
  imports: [UrlModule, QueueModule],
})
export class AppModule {}
