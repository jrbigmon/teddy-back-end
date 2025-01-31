import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { USERS_QUEUE } from '../../../@share/constants/redis.queues';
import { UserQueueConsumer } from './users/users.queue.consumer';
import { UserModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    BullModule.registerQueue({
      name: USERS_QUEUE,
      defaultJobOptions: {
        attempts: 3,
      },
    }),
  ],
  providers: [UserQueueConsumer],
  exports: [UserQueueConsumer],
})
export class QueueModule {}
