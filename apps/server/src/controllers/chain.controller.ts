import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';

import { APIResponse, FlowRunResult } from '@shared';
import { Chain } from '../entities/chain';
import { FlowFactory } from '../flow-factory';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

export class ChainController {
	static async createChain(req: Request, res: Response) {
		try {
			const { name, description } = req.body;

			if (!name) {
				const response: APIResponse<null> = {
					result: null,
					errors: [
						{
							status: 400,
							message: 'Chain name is required',
						},
					],
				};
				return res.status(400).json(response);
			}

			const chainRepository = AppDataSource.getRepository(Chain);

			// Check if chain name already exists
			const existingChain = await chainRepository.findOne({ where: { name: name } });
			if (existingChain) {
				const response: APIResponse<null> = {
					result: null,
					errors: [{ status: 400, message: `Chain ${name} already exists` }],
				};
				return res.status(400).json(response);
			}

			const chain = new Chain();
			chain.name = name;
			chain.description = description;
			chain.createdAt = new Date();
			chain.updatedAt = new Date();
			chain.chainFlows = [];

			await chainRepository.save(chain);

			const response: APIResponse<Chain> = {
				result: chain,
				errors: [],
			};
			res.status(201).json(response);
		} catch (error) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to create chain',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	static async getAllChains(req: Request, res: Response) {
		try {
			const chainRepository = AppDataSource.getRepository(Chain);
			const chains = await chainRepository.find({
				relations: ['chainFlows', 'chainFlows.flow'],
				order: {
					chainFlows: {
						order: 'ASC',
					},
				},
			});

			const response: APIResponse<Chain[]> = {
				result: chains,
				errors: [],
			};

			res.json(response);
		} catch (error) {
			console.log('Failed to retrieve chains');
			console.error(error);
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to retrieve chains',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	static async updateChain(req: Request, res: Response) {
		try {
			const chain = req.body;
			const chainRepository = AppDataSource.getRepository(Chain);
			const updatedChain = await chainRepository.save(chain);
			const response: APIResponse<Chain> = {
				result: updatedChain,
				errors: [],
			};
			res.json(response);
		} catch (error: any) {
			const response: APIResponse<null> = {
				result: null,
				errors: [
					{
						status: 500,
						message: 'Failed to update chain',
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				],
			};
			res.status(500).json(response);
		}
	}

	static async testChain(req: Request, res: Response) {
		const { chain } = req.body;

		ChainController.startCodeGenPlaywrightForChain(chain, res);
	}

	static async startCodeGenPlaywrightForChain(chain: Chain, res: Response) {
		console.log('Starting codegen for chain');
		console.log(chain);

		const response: APIResponse<FlowRunResult[]> = {
			result: [],
			errors: [],
		};

		let errorHit = false;
		for (const chainFlow of chain.chainFlows) {
			const flow = chainFlow.flow;
			const fileName = flow.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
			const filePath = path
				.join(__dirname, '../../../recordings', `${fileName}.flow.spec.ts`)
				.replace(/\\/g, '/');

			const code = FlowFactory.compileFlow(flow);
			//save the file
			fs.writeFileSync(filePath, code, 'utf-8');

			// add --ui for ui mode or --headed for headed mode
			const launchCommand = `npx playwright test ${filePath} --headed`;
			//start the test for the flows generated code
			const childProcess = exec(launchCommand, async (error, stdout, stderr) => {
				console.log(`stdout: ${stdout} \n\n`);
				console.error(`stderr: ${stderr}\n\n`);

				// extract the test results
				response.result.push(FlowFactory.buildFlowRunResult(stdout, stderr, flow));

				if (error) {
					errorHit = true;
					response.errors.push({
						status: 500,
						message: 'Failed to run flow',
						error: error instanceof Error ? error.message : 'Unknown error',
					});
				}
			});

			//wait for the child process to finish
			while (childProcess.exitCode === null) {
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
			if (errorHit) {
				break;
			}
		}

		res.json(response);
	}
}
