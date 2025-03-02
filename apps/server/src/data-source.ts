import { DataSource } from 'typeorm';

import { Flow } from './entities/flow';
import { Test } from './entities/test';
import { FlowTest } from './entities/flow-test';
import { Chain } from './entities/chain';
import { ChainFlow } from './entities/chain-flow';


export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'speedrun.db',
  entities: [Test, Flow,FlowTest,Chain,ChainFlow],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development'
});