import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import fs from 'fs';
import routes from './routes';

const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const recordingsDir = path.join(__dirname, '../../../recordings');
if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir);

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });



app.use('/api', routes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
