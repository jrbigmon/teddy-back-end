import { Module, Provider } from '@nestjs/common';
import { modelsModule } from '../database/database.module';
import { UserRepository } from './repository/users.repository';
import { UserService } from './users.service';
import { UserController } from './users.controller';

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
  controllers: [UserController],
  providers: services,
  exports: services,
})
export class UserModule {}
