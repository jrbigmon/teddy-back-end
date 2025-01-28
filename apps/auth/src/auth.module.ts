import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [UserModule, DatabaseModule],
})
export class AuthModule {}
