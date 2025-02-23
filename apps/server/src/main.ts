import express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { AppDataSource } from './data-source';
import { APIResponse } from '@shared';
import { exec } from 'child_process';
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

// app.post('/start-codegen', async (req, res) => {
// 	const { url, testName } = req.body;

// 	if (!url) {
// 		const response: APIResponse<null> = {
// 			result: null,
// 			errors: [{ status: 400, message: 'URL is required' }],
// 		};
// 		return res.status(400).json(response);
// 	}

// 	const testFile = path.join(recordingsDir, `${testName}.spec.ts`);

// 	if (fs.existsSync(testFile)) {
// 		const response: APIResponse<null> = {
// 			result: null,
// 			errors: [{ status: 400, message: `A test with the name ${testName} already exists` }],
// 		};
// 		return res.status(400).json(response);
// 	}

// 	const sanized = url.replace(/[^a-zA-Z0-9-_.:\/]/g, '');

// 	exec(`npx playwright codegen ${sanized} --output ${testFile}`, (error, stdout, stderr) => {
// 		if (error) {
// 			const response: APIResponse<null> = {
// 				result: null,
// 				errors: [{ status: 500, message: 'Failed to start CodeGen', error: error.message }],
// 			};
// 			return res.status(500).json(response);
// 		}
// 		if (stderr) console.error(`CodeGen stderr: ${stderr}`);

// 		console.log(`Test recorded and saved at: ${testFile}`);
// 	});

// 	const response: APIResponse<{ testFile: string }> = {
// 		result: { testFile },
// 		errors: [],
// 	};
// 	res.json(response);
// });

// app.post('/replay-test', async (req, res) => {
// 	const { testName } = req.body;
// 	const testFile = path.join(recordingsDir, `${testName}.spec.ts`);

// 	if (!fs.existsSync(testFile)) {
// 		const response: APIResponse<null> = {
// 			result: null,
// 			errors: [{ status: 404, message: `Test file ${testName} does not exist` }],
// 		};
// 		return res.status(404).json(response);
// 	}

// 	const sanitized = testFile.replace(/[^a-zA-Z0-9-_.]/g, '');

// 	exec(`npx playwright test ${testFile} --headed`, (error, stdout, stderr) => {
// 		if (error) {
// 			const response: APIResponse<null> = {
// 				result: null,
// 				errors: [{ status: 500, message: 'Failed to replay test', error: error.message }],
// 			};
// 			return res.status(500).json(response);
// 		}

// 		const response: APIResponse<{ output: string }> = {
// 			result: { output: stdout },
// 			errors: [],
// 		};
// 		res.json(response);
// 	});
// });
