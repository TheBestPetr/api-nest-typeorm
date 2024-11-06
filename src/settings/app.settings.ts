import { config } from 'dotenv';
import * as process from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';

config();

export const SETTINGS = {
  PORT: process.env.APP_PORT || '',
  DB_CONNECTION: {
    CONNECT_TO_TEST_DB: TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CONNECT_TO_NEON_DB: TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.NEON_POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: true,
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
