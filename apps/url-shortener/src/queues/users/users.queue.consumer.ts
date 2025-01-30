import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { USERS_QUEUE } from '../../../../@share/constants/redis.queues';
import { USER_CREATED } from '../../../../@share/constants/redis.events';
import { Job } from 'bull';
import { UserService } from '../../users/users.service';
import { Logger } from '@nestjs/common';

@Processor(USERS_QUEUE)
export class UserQueueConsumer {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger(UserQueueConsumer.name);

  @Process(USER_CREATED)
  async handleUserCreated(job: Job<{ id: string; name: string }>) {
    const { id, name } = job?.data || {};

    await this.userService.create({
      id,
      name,
    });

    return true;
  }

  @OnQueueCompleted()
  async handleJobCompleted(job: Job, result: boolean) {
    this.logger.verbose(
      JSON.stringify({
        jobId: job.id,
        event: job.name,
        data: job.data,
        result,
      }),
    );
  }
}
