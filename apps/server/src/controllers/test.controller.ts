import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Test } from '../entities/test';
import * as path from 'path';
import { exec } from 'child_process';
import { APIResponse } from '@shared';

export class TestController {
	
	
	static async startCodegen(req: Request, res: Response) {
		try {
			const { url, testName, description } = req.body;
			const testRepository = AppDataSource.getRepository(Test);

			if (!url || !testName) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 400, message: 'URL and test name are required' }],
				};
				return res.status(400).json(response);
			}

			const recordingsDir = path.join(__dirname, '../../../recordings');
			const testFile = path.join(recordingsDir, `${testName}.spec.ts`);

			const existingTest = await testRepository.findOne({ where: { name: testName } });
			if (existingTest) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 400, message: `A test with the name ${testName} already exists` }],
				};
				return res.status(400).json(response);
			}

			const sanitizedUrl = url.replace(/[^a-zA-Z0-9-_.:\/]/g, '');

			exec(`npx playwright codegen ${sanitizedUrl} --output ${testFile}`, async (error, stdout, stderr) => {
				if (error) {
					const response: APIResponse<null> = {
						result: null,
						errors: [{ status: 500, message: 'Failed to start CodeGen', error: error.message }],
					};
					return res.status(500).json(response);
				}

				const test = new Test();
				test.name = testName;
				test.description = description || '';
				test.filePath = testFile;
				await testRepository.save(test);

				const response: APIResponse<Test> = {
					result: test,
					errors: [],
				};
				res.json(response);
			});
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Internal server error',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	//get all tests
	static async getAllTests(req: Request, res: Response) {
		try {
			const testRepository = AppDataSource.getRepository(Test);
			const tests = await testRepository.find();
			const response: APIResponse<Test[]> = {
				result: tests,
				errors: [],
			};
			res.json(response);
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Internal server error',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	//add new test
	static async addTest(req: Request, res: Response) {
		try {
			const { name, description,url } = req.body;
			const testRepository = AppDataSource.getRepository(Test);

			const existingTest = await testRepository.findOne({ where: { name } });
			if (existingTest) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 400, message: `A test with the name ${name} already exists` }],
				};
				return res.status(400).json(response);
			}

			const filePath = path.join(__dirname, '../../../recordings', `${name}.spec.ts`);

			const test = new Test();
			test.name = name;
			test.description = description || '';
			test.filePath = filePath;
			await testRepository.save(test);

			const response: APIResponse<Test> = {
				result: test,
				errors: [],
			};

			//start the codegen for the test using the url
			exec(`npx playwright codegen ${url} --output ${filePath}`, async (error, stdout, stderr) => {
				if (error) {
					const response: APIResponse<null> = {
						result: null,
						errors: [{ status: 500, message: 'Failed to start CodeGen', error: error.message }],
					};
					return res.status(500).json(response);
				}
				res.json(response);
			});

		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Internal server error',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	//executeTest

	static async executeTest(req: Request, res: Response) {
		try{

			const testId = req.body.id;
			const test = await AppDataSource.getRepository(Test).findOneBy({ id: testId });

			if(!test){
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 404, message: `Test with id ${testId} not found` }],
				};
				res.json(response);
				return;
			}
			console.log(test.filePath);
			//open the test using npx playwright test
			exec(`npx playwright test ${test.filePath}`, async (error, stdout, stderr) => {
				if (error) {
					console.log(error);
					const response: APIResponse<null> = {
						result: null,
						errors: [{ status: 500, message: 'Failed to execute test', error: error.message }],
					};
					return res.status(500).json(response);
				}

				const response: APIResponse<null> = {
					result: null,
					errors: [],
				};
				res.json(response);
			});




		}catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Internal server error',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}


	//delete test
	static async deleteTest(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const testRepository = AppDataSource.getRepository(Test);

			const test = await testRepository.findOneBy({
				id: parseInt(id),
			});
			if (!test) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 404, message: `Test with id ${id} not found` }],
				};
				return res.status(404).json(response);
			}

			await testRepository.remove(test);

			const response: APIResponse<null> = {
				result: null,
				errors: [],
			};
			res.json(response);
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Internal server error',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}
}
