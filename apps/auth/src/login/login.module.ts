import { Module, Provider } from '@nestjs/common';
import { modelsModule } from '../database/database.module';
import { LoginService } from './login.service';
import { UserModule } from '../users/users.module';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_TEST } from '../../../@share/constants/secrets-to-tests';

const services: Provider[] = [LoginService];
const isTestEnvironment = process.env.NODE_ENV === 'test';
const secretTest = isTestEnvironment ? JWT_SECRET_TEST : null;

@Module({
  imports: [
    modelsModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || secretTest,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [LoginController],
  providers: services,
  exports: services,
})
export class LoginModule {}
