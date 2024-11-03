import { config } from 'dotenv';
import * as process from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';

config();

export const SETTINGS = {
  PORT: process.env.APP_PORT || '',
  DB_CONNECTION: {
    CONNECT_TO_LOCAL_DB: TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sa',
      database: 'HwNest',
      autoLoadEntities: false,
      synchronize: false,
    }),
    CONNECT_TO_NEON_DB: TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.NEON_POSTGRESQL_URL || '',
      autoLoadEntities: false,
      synchronize: false,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
  },

  NODEMAILER: {
    USER: process.env.EMAIL_ACCOUNT_USER,
    PASSWORD: process.env.EMAIL_ACCOUNT_PASSWORD,
  },
  BASIC: {
    LOGIN: process.env.BASIC_LOGIN || '',
    PASSWORD: process.env.BASIC_PASSWORD || '',
  },
  JWT_SECRET: process.env.JWT_SECRET || '',
};
