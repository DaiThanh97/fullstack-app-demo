import { ConnectionOptions } from 'typeorm';

export default {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT!),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: !process.env.IS_PROD,
  logging: !process.env.IS_PROD,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../migration/**/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: './migration',
    subscribersDir: 'src/subscriber',
  },
} as ConnectionOptions;
