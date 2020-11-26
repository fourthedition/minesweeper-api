import { Sequelize } from 'sequelize-typescript';
import { User } from '../entity/user.entity'
import * as dotenv from "dotenv";

dotenv.config();
const db:any = {
    dialect: 'mysql',
    host: 'localhost',
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  }
export const databaseProviders = [
  {
    provide: 'db',
    
    useFactory: async () => {
      const sequelize = new Sequelize(db);
      sequelize.addModels([User]);
      await sequelize.sync();
    // await sequelize.sync({ force: true })
      return sequelize;
    },
  },
];