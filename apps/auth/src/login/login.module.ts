import { Module, Provider } from '@nestjs/common';
import { modelsModule } from '../database/database.module';
import { LoginService } from './login.service';
import { UserModule } from '../users/users.module';
import { LoginController } from './login.controller';
import { AuthGuardModule } from '../../../@share/auth-guard/auth-guard.module';

const services: Provider[] = [LoginService];

@Module({
  imports: [modelsModule, UserModule, AuthGuardModule],
  controllers: [LoginController],
  providers: services,
  exports: services,
})
export class LoginModule {}
