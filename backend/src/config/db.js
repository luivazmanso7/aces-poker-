import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    logging: false,
  }
);

export default sequelize;

console.log("DB_USER:", process.env.DB_USER);