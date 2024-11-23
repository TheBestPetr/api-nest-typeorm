import { DataSource } from 'typeorm';
import process from 'process';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
});
