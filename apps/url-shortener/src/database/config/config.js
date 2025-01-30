require('dotenv').config();

module.exports = {
  development: {
    username: process.env.URL_SHORTENER_DATABASE_USER,
    password: process.env.URL_SHORTENER_DATABASE_PASSWORD,
    database: process.env.URL_SHORTENER_DATABASE_NAME,
    host: process.env.URL_SHORTENER_DATABASE_HOST,
    port: process.env.URL_SHORTENER_DATABASE_PORT,
    migrationStorageTableName: 'sequelize_meta',
    dialect: 'postgres',
  },
};
