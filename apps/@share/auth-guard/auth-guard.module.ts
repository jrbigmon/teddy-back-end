import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_TEST } from '../constants/secrets-to-tests';
import { JwtGuardService } from './jwt.guard.service';
import { AuthGuard } from './auth-guard';
import { DecodeJwt } from './decode-jwt';
import { ConfigModule } from '@nestjs/config';

const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
const secretTest = isDevelopmentEnvironment ? JWT_SECRET_TEST : null;

const services: Provider[] = [JwtGuardService, AuthGuard, DecodeJwt];

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || secretTest,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: services,
  exports: services,
})
export class AuthGuardModule {}
