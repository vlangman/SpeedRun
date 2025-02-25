import { DataSource } from 'typeorm';

import { Flow } from './entities/flow';
import { Test } from './entities/test';
import { FlowTest } from './entities/flow-test';


export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'speedrun.db',
  entities: [Test, Flow,FlowTest],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
});