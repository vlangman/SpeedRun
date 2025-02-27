import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Test } from '../entities/test';
import * as path from 'path';
import { exec, execSync } from 'child_process';
import { APIResponse } from '@shared';
import { QueryRunner, Repository } from 'typeorm';
import fs from 'fs';

export class TestController {
	static async startCodeGenPlaywrightForTest(
		queryRunner: QueryRunner,
		test: Test,
		testRepository: Repository<Test>,
		res: Response
	) {
		const url = test.startUrl;
		const fileName = test.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
		const filePath = path.join(__dirname, '../../../recordings', `${fileName}.spec.ts`);

		// check if on unix / linux or windows
		const isWindows = process.platform === 'win32';
		const launchCommand = isWindows
			? `cmd /c "set DEBUG=pw:api && npx playwright codegen ${url} --output ${filePath} --ignore-https-errors"`
			: `DEBUG=pw:api npx playwright codegen ${url} --output ${filePath}`;

		//start the codegen for the test using the url
		exec(launchCommand, async (error, stdout, stderr) => {
			// ✅ Extract last URL from stdout
			test.endUrl = (await TestController.extractLastNavigationUrl(stderr)) ?? '';

			const response: APIResponse<Test | null> = {
				result: null,
				errors: [],
			};
			if (error) {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}

				response.errors.push({ status: 500, message: 'Failed to start CodeGen', error: error.message });
				//remove the file
				TestController.removeFile(filePath);

				return res.status(500).json(response);
			} else {
				await queryRunner.commitTransaction();
				await testRepository.save(test);
				response.result = test;
				return res.json(response);
			}
		});
	}

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

			const fileName = testName.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
			exec(
				`npx playwright codegen ${sanitizedUrl} --output ${fileName} --ignore-https-errors`,
				async (error, stdout, stderr) => {
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
				}
			);
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

	static async recordTest(req: Request, res: Response) {
		const queryRunner = AppDataSource.createQueryRunner();
		await queryRunner.startTransaction();

		//first remove the test file
		const { id } = req.body;
		const testRepository = queryRunner.manager.getRepository(Test);

		const test = await testRepository.findOneBy({ id });
		if (!test) {
			const response: APIResponse<null> = {
				result: null,
				errors: [{ status: 404, message: `Test with id ${id} not found` }],
			};
			return res.status(404).json(response);
		}

		const fileName = test.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
		const filePath = path.join(__dirname, '../../../recordings', `${fileName}.spec.ts`);

		try {
			TestController.removeFile(filePath);
		} catch (error) {
			console.error(error);
		}

		//now re-record the test
		TestController.startCodeGenPlaywrightForTest(queryRunner, test, testRepository, res);
	}

	static async updateTestCode(req: Request, res: Response) {
		try {
			const testRepository = AppDataSource.getRepository(Test);
			const { code, id } = req.body;

			const test = await testRepository.findOneBy({ id });
			if (!test) throw new Error(`Test with id ${id} not found`);

			const fileName = test.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
			const filePath = path.join(__dirname, '../../../recordings', `${fileName}.spec.ts`);


			fs.writeFileSync(filePath, code, { encoding: 'utf8' });
			

			// //write the code to the file
			// await new Promise<void>((resolve, reject) => {
			// 	const command = process.platform === 'win32' ? `echo ${code} > ${filePath}` : `echo '${code}' > ${filePath}`;
			// 	exec(command, (error, stdout, stderr) => {
					
			// 		console.log('Code updated');
			// 		console.log('stdout:', stdout);
			// 		console.error('stderr:', stderr);

			// 		if (error) {
			// 			reject(error);
			// 		} else {
			// 			resolve();
			// 		}
			// 	});
			// });

			res.send({ result: true, errors: [] });
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

			//fetch the code for each test
			for (const test of tests) {
				const fileName = test.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
				const filePath = path.join(__dirname, '../../../recordings', `${fileName}.spec.ts`);

				try {
					const code = await new Promise<string>((resolve, reject) => {
						const command = process.platform === 'win32' ? `type ${filePath}` : `cat ${filePath}`;
						exec(command, (error, stdout, stderr) => {
							if (error) {
								reject(error);
							} else {
								resolve(stdout);
							}
						});
					});
					test.code = code;
				} catch (error) {
					console.error(error);
				}
			}

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
			const fileName = name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
			const filePath = path.join(__dirname, '../../../recordings', `${fileName}.spec.ts`);

			const test: Omit<Test, 'id' | 'code'> = {
				createdAt: new Date(),
				description: description,
				name: name,
				endUrl: '',
				startUrl: url,
				flowTests: [],
				updatedAt: new Date(),
			};

			TestController.startCodeGenPlaywrightForTest(queryRunner, test as Test, testRepository, res);
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

			TestController.removeFile(filePath);

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

	static async extractLastNavigationUrl(stderr: string) {
		// const urlMatches = stdout.match(/https?:\/\/[^\s'"]+/g); // Match all URLs in stdout
		// const lastVisitedUrl = urlMatches ? urlMatches[urlMatches.length - 1] : null;

		// if (lastVisitedUrl) {
		// 	console.log('Captured End URL:', lastVisitedUrl);
		// 	return lastVisitedUrl;

		// }
		// console.log('Codegen completed');
		// console.error('stderr:', stderr);

		// Find the last occurrence of "navigated to"
		const lastIndex = stderr.lastIndexOf('navigated to');

		if (lastIndex !== -1) {
			// Extract substring from last occurrence onward
			const lastNavigationText = stderr.slice(lastIndex);

			// Regex to capture the URL
			const match = lastNavigationText.match(/navigated to\s+"([^"]+)"/);

			console.log('Last Navigated URL:', match);

			if (match) {
				return match[1];
			}
		}

		return null;
	}

	static removeFile(filePath: string) {
		const isWindows = process.platform === 'win32';
		const command = isWindows ? `del ${filePath}` : `rm -f ${filePath}`;
		execSync(command);
	}
}
