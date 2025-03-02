import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

import { APIResponse, FlowRunResult } from '@shared';
import { Flow } from '../entities/flow';
import { FlowFactory } from '../flow-factory';
import { chromium, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
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
			flow.description = description;
			flow.createdAt = new Date();
			flow.updatedAt = new Date();
			flow.flowTests = [];

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
			const flows = await flowRepository.find({
				relations: ['flowTests', 'flowTests.test', 'flowTests.flow'],
				order: {
					flowTests: {
						order: 'ASC',
					},
				},
			});

			const response: APIResponse<Flow[]> = {
				result: flows,
				errors: [],
			};

			res.json(response);
		} catch (error) {
			console.log('Failed to retrieve flows');
			console.error(error);
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

	static async updateFlow(req: Request, res: Response) {
		try {
			const flow = req.body;
			const flowRepository = AppDataSource.getRepository(Flow);
			const updatedFlow = await flowRepository.save(flow);
			const response: APIResponse<Flow> = {
				result: updatedFlow,
				errors: [],
			};
			res.json(response);
		} catch (error: any) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to update flow',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	static async testFlow(req: Request, res: Response) {
		const { flow } = req.body;

		FlowController.startCodeGenPlaywrightForFlow(flow, res);
	}

	static startCodeGenPlaywrightForFlow(flow: Flow, res: Response) {
		console.log('Starting codegen for flow');
		console.log(flow);
		const fileName = flow.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
		const filePath = path.join(__dirname, '../../../recordings', `${fileName}.flow.spec.ts`).replace(/\\/g, '/');

		const code = FlowFactory.compileFlow(flow);
		//save the file
		fs.writeFileSync(filePath, code, 'utf-8');

		// // check if on unix / linux or windows
		// const isWindows = process.platform === 'win32';
		// const deleteFileCommand = isWindows ? `del ${filePath}` : `rm ${filePath}`;

		// add --ui for ui mode or --headed for headed mode
		const launchCommand = `npx playwright test  ${filePath} --headed`;
		// console.log(code)
		//start the test for the flows generated code
		exec(launchCommand, async (error, stdout, stderr) => {
			console.log(`stdout: ${stdout} \n\n`);
			console.error(`stderr: ${stderr}\n\n`);

			// extract the test results
			const result = FlowFactory.buildFlowRunResult(stdout, stderr, flow);

			const response: APIResponse<FlowRunResult> = {
				result: result,
				errors: [],
			};
			res.json(response);
		});
	}
}
