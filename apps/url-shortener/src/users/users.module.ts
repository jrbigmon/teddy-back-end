import { Module, Provider } from '@nestjs/common';
import { UserRepository } from './repository/users.repository';
import { UserService } from './users.service';
import { modelsModule } from '../database/database.module';

const services: Provider[] = [
  UserRepository,
  UserService,
  {
    provide: 'USER_REPOSITORY',
    useClass: UserRepository,
  },
];

@Module({
  imports: [modelsModule],
  providers: services,
  exports: services,
})
export class UserModule {}
