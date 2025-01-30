require('dotenv').config();

module.exports = {
  development: {
    username: process.env.AUTH_DATABASE_USER,
    password: process.env.AUTH_DATABASE_PASSWORD,
    database: process.env.AUTH_DATABASE_NAME,
    host: process.env.AUTH_DATABASE_HOST,
    port: process.env.AUTH_DATABASE_PORT,
    migrationStorageTableName: 'sequelize_meta',
    dialect: 'postgres',
  },
};
