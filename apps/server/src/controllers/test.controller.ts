import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Test } from '../entities/test';
import * as path from 'path';
import { exec, execSync } from 'child_process';
import { APIResponse } from '@shared';

export class TestController {
	static async startCodegen(req: Request, res: Response) {
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const { url, testName, description } = req.body;
			const testRepository = queryRunner.manager.getRepository(Test);

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
					if (queryRunner.isTransactionActive) {
						await queryRunner.rollbackTransaction();
					}
					const response: APIResponse<null> = {
						result: null,
						errors: [{ status: 500, message: 'Failed to start CodeGen', error: error.message }],
					};
					return res.status(500).json(response);
				}

				const test = new Test();
				test.name = testName;
				test.description = description || '';
				await testRepository.save(test);

				await queryRunner.commitTransaction();

				const response: APIResponse<Test> = {
					result: test,
					errors: [],
				};
				res.json(response);
			});
		} catch (error) {
			if (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction();
			}
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
		} finally {
			await queryRunner.release();
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
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.startTransaction();
	
		try {
			const { name, description, url } = req.body;
			const testRepository = queryRunner.manager.getRepository(Test);
	
			const existingTest = await testRepository.findOne({ where: { name } });
			if (existingTest) {
				throw new Error(`A test with the name ${name} already exists`);
			}
	
			const filePath = path.join(__dirname, '../../../recordings', `${name}.spec.ts`);
	
			const test: Omit<Test,"id"> = {
				createdAt: new Date(),
				description: description,
				name: name,
				endUrl: '',
				startUrl: url,
				flowTests: [],
				updatedAt: new Date(),
			};
	
			const response: APIResponse<Test> = {
				result: test as Test,
				errors: [],
			};
	
			//start the codegen for the test using the url
			exec(
				`cmd /c "set DEBUG=pw:api && npx playwright codegen ${url} --output ${filePath}"`,
				async (error, stdout, stderr) => {
					// ✅ Extract last URL from stdout
					const urlMatches = stdout.match(/https?:\/\/[^\s'"]+/g); // Match all URLs in stdout
					const lastVisitedUrl = urlMatches ? urlMatches[urlMatches.length - 1] : null;
	
					if (lastVisitedUrl) {
						console.log('Captured End URL:', lastVisitedUrl);
						test.endUrl = lastVisitedUrl;
						await testRepository.save(test);
					}
					console.log('Codegen completed');
					console.error('stderr:', stderr);
					
					// Find the last occurrence of "navigated to"
					const lastIndex = stderr.lastIndexOf('navigated to');
					
					if (lastIndex !== -1) {
						// Extract substring from last occurrence onward
						const lastNavigationText = stderr.slice(lastIndex);
					
						// Regex to capture the URL
						const match = lastNavigationText.match(/navigated to\s+"([^"]+)"/);
	
						console.log('Last Navigated URL:', match);
						
						if (match) {
							test.endUrl = match[1];
						}
					}
	
					if (error) {
						if (queryRunner.isTransactionActive) {
							await queryRunner.rollbackTransaction();
						}
						const response: APIResponse<null> = {
							result: null,
							errors: [{ status: 500, message: 'Failed to start CodeGen', error: error.message }],
						};
						return res.status(500).json(response);
					} else {
						await queryRunner.commitTransaction();
						await testRepository.save(test);
	
						res.json(response);
					}
				}
			);
		} catch (error) {
			console.error(error);
			if (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction();
			}
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
		} finally {
			await queryRunner.release();
		}
	}
	//executeTest
	static async executeTest(req: Request, res: Response) {
		try {
			const testId = req.body.id;
			const test = await AppDataSource.getRepository(Test).findOneBy({ id: testId });

			if (!test) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 404, message: `Test with id ${testId} not found` }],
				};
				res.json(response);
				return;
			}
			console.log(test.name);
			//open the test using npx playwright test
			const realPath = path.join(__dirname, '../../../recordings', `${test.name}.spec.ts`).replace(/\\/g, '/');
			console.log(realPath);

			exec(`npx playwright test ${realPath} --headed`, async (error, stdout, stderr) => {
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

	//delete test
	static async deleteTest(req: Request, res: Response) {
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.startTransaction();

		try {
			const { id } = req.params;
			const testRepository = queryRunner.manager.getRepository(Test);

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

			//now remove the file
			const filePath = path.join(__dirname, '../../../recordings', `${test.name}.spec.ts`);

			execSync(`rm -f ${filePath}`);

			await queryRunner.commitTransaction();

			const response: APIResponse<null> = {
				result: null,
				errors: [],
			};
			res.json(response);
		} catch (error) {
			console.error(error);
			if (queryRunner.isTransactionActive) {
				await queryRunner.rollbackTransaction();
			}
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
		} finally {
			await queryRunner.release();
		}
	}
}
