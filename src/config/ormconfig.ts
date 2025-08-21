import { DataSourceOptions } from 'typeorm';
import { config } from './environment';

const ormConfig: DataSourceOptions = {
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.nodeEnv === 'development',
  logging: config.nodeEnv === 'development',
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit: 10,
  },
};

export default ormConfig;
