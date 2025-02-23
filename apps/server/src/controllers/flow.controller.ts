import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

import { APIResponse } from '@shared';
import { Flow } from '../entities/flow';
import { Test } from '../entities/test';
import { exec } from 'child_process';

export class FlowController {
	static async createFlow(req: Request, res: Response) {
		try {
			const { flowName, description } = req.body;

			if (!flowName) {
				const response: APIResponse<null> = {
					result: null,
					errors: [
						{
							status: 400,
							message: 'Flow name and at least one test name are required',
						},
					],
				};
				return res.status(400).json(response);
			}

			const flowRepository = AppDataSource.getRepository(Flow);

			// Check if flow name already exists
			const existingFlow = await flowRepository.findOne({ where: { name: flowName } });
			if (existingFlow) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 400, message: `Flow ${flowName} already exists` }],
				};
				return res.status(400).json(response);
			}

			const flow = new Flow();
			flow.name = flowName;
			flow.description = description || '';
			flow.tests = [];

			await flowRepository.save(flow);

			const response: APIResponse<Flow> = {
				result: flow,
				errors: [],
			};
			res.status(201).json(response);
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to create flow',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	static async getAllFlows(req: Request, res: Response) {
		try {
			const flowRepository = AppDataSource.getRepository(Flow);
			const flows = await flowRepository.find({ relations: ['tests'] });

			const response: APIResponse<Flow[]> = {
				result: flows,
				errors: [],
			};
			res.json(response);
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to retrieve flows',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	static async executeFlow(req: Request, res: Response) {
		try {
			const { flowName } = req.body;
			const flowRepository = AppDataSource.getRepository(Flow);

			const flow = await flowRepository.findOne({
				where: { name: flowName },
				relations: ['tests'],
			});

			if (!flow) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 404, message: `Flow ${flowName} not found` }],
				};
				return res.status(404).json(response);
			}

			// Execute tests sequentially
			const results: Promise<any>[] = [];
			for (const test of flow.tests) {
				const result = await new Promise<any>((resolve) => {
					exec(`npx playwright test ${test.filePath} --headed`, (error, stdout, stderr) => {
						resolve({
							testName: test.name,
							success: !error,
							output: stdout,
							error: error?.message,
						});
					});
				});
				results.push(result);
			}

			const response: APIResponse<{ results: any[] }> = {
				result: { results },
				errors: [],
			};
			res.json(response);
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to execute flow',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}
}
