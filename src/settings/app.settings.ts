import { config } from 'dotenv';
import * as process from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

config();

export const SETTINGS = {
  PORT: process.env.APP_PORT || '',
  DB_CONNECTION: {
    CONNECT_TO_TEST_DB: TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
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
    LOGIN: process.env.BASIC_LOGIN,
    PASSWORD: process.env.BASIC_PASSWORD,
  },

  REQ_COUNTER: ThrottlerModule.forRoot([
    {
      ttl: parseInt(<string>process.env.REQ_COUNTER_TIME),
      limit: parseInt(<string>process.env.REQ_COUNTER_LIMIT),
    },
  ]),

  JWT: {
    TIME: {
      ACCESS: process.env.ACCESS_TOKEN_TIME,
      REFRESH: process.env.REFRESH_TOKEN_TIME,
    },
    JWT_SECRET: process.env.JWT_SECRET || '',
  },
};
