import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/users.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [UserModule, LoginModule, DatabaseModule],
})
export class AuthModule {}
