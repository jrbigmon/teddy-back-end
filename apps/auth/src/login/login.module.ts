import { Module, Provider } from '@nestjs/common';
import { modelsModule } from '../database/database.module';
import { LoginService } from './login.service';
import { UserModule } from '../users/users.module';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';

const services: Provider[] = [LoginService];

@Module({
  imports: [
    modelsModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [LoginController],
  providers: services,
  exports: services,
})
export class LoginModule {}
