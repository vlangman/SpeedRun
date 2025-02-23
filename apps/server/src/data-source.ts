import { DataSource } from 'typeorm';

import { Flow } from './entities/flow';
import { Test } from './entities/test';


export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'speedrun.db',
  entities: [Test, Flow],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
});