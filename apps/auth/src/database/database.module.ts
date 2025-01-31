import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import UserModel from '../users/model/users.model';
import { ConfigModule } from '@nestjs/config';
import { Dialect } from 'sequelize';

export const models = [UserModel];
export const modelsModule = SequelizeModule.forFeature(models);

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: process.env.AUTH_DATABASE_DIALECT as Dialect,
      host: process.env.AUTH_DATABASE_HOST,
      port: Number(process.env.AUTH_DATABASE_PORT),
      username: process.env.AUTH_DATABASE_USER,
      password: process.env.AUTH_DATABASE_PASSWORD,
      database: process.env.AUTH_DATABASE_NAME,
      autoLoadModels: process.env.NODE_ENV === 'development',
      synchronize: process.env.NODE_ENV === 'development',
      models,
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
