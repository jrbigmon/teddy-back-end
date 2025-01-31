import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { Dialect } from 'sequelize';
import UrlModel from '../url/model/urls.model';
import ClickModel from '../url/model/clicks.model';
import UserModel from '../users/model/users.model';

export const models = [UrlModel, ClickModel, UserModel];
export const modelsModule = SequelizeModule.forFeature(models);

const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: process.env.URL_SHORTENER_DATABASE_DIALECT as Dialect,
      host: process.env.URL_SHORTENER_DATABASE_HOST,
      port: Number(process.env.URL_SHORTENER_DATABASE_PORT),
      username: process.env.URL_SHORTENER_DATABASE_USER,
      password: process.env.URL_SHORTENER_DATABASE_PASSWORD,
      database: process.env.URL_SHORTENER_DATABASE_NAME,
      autoLoadModels: isDevelopmentEnvironment,
      synchronize: isDevelopmentEnvironment,
      models,
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
