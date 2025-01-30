import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { User } from '../../users/domain/users.entity';
import { USERS_QUEUE } from '../../../../@share/constants/redis.queues';
import { USER_CREATED } from '../../../../@share/constants/redis.events';
import { Transaction } from 'sequelize';

@Injectable()
export class UserQueueProducer {
  constructor(
    @InjectQueue(USERS_QUEUE)
    private queue: Queue,
  ) {}

  async userCreated(user: User, transaction?: Transaction): Promise<void> {
    if (transaction) {
      transaction.afterCommit(async () => {
        await this.queue.add(USER_CREATED, {
          id: user.getId(),
          name: user.getName(),
        });
      });
      return;
    }

    await this.queue.add(USER_CREATED, {
      id: user.getId(),
      name: user.getName(),
    });
  }
}
