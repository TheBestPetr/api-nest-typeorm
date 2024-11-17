import { config } from 'dotenv';
import * as process from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

config();

export const SETTINGS = {
  PORT: process.env.APP_PORT || '',

  NODEMAILER: {
    USER: process.env.EMAIL_ACCOUNT_USER,
    PASSWORD: process.env.EMAIL_ACCOUNT_PASSWORD,
  },

  REQ_COUNTER: ThrottlerModule.forRoot([
    {
      ttl: Number(process.env.REQ_COUNTER_TIME),
      limit: Number(process.env.REQ_COUNTER_LIMIT),
    },
  ]),
};

export const AUTH_SETTINGS = {
  JWT: {
    TIME: {
      ACCESS: process.env.ACCESS_TOKEN_TIME,
      REFRESH: process.env.REFRESH_TOKEN_TIME,
    },
    JWT_SECRET: String(process.env.JWT_SECRET),
  },

  BASIC: {
    LOGIN: process.env.BASIC_LOGIN,
    PASSWORD: process.env.BASIC_PASSWORD,
  },
};

export const DB_SETTINGS = {
  USED_DB: process.env.USED_DB,
  DB_CONNECTION: {
    CONNECT_TO_TEST_DB: TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      //logging: true,
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
};
