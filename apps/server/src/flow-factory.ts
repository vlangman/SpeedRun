import path from 'path';
import { Flow } from './entities/flow';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FlowRunResult, FlowTestRunResult, Test } from '@shared';
import { FlowTest } from './entities/flow-test';

export class FlowFactory {
	static compileFlow(flow: Flow): string {
		function wrapTestCodeInTryCatch(flowtest: FlowTest, testCode: string): string {
			return `
try {
	
	console.log('EXECUTING_FLOW_TEST_ID:${flowtest.id}');

	${testCode}

	console.log('SUCCESSFUL_FLOW_TEST_EXECUTION:${flowtest.id}');

} catch (error) {
	console.log('FAILED_FLOW_TEST_EXECUTION:${flowtest.id}');
	console.error(error.error?.message || error.message);
}
`;
		}

		const testsPath = path.join(__dirname, '../../../recordings');

		let compiledCode = `const { test, expect } = require('@playwright/test');
test.use({
	ignoreHTTPSErrors: true
});

test('${flow.name}', async ({ page }) => {`;

		const tests = flow.flowTests.map((f) => f.test);
		const testCodeMap = new Map<number, string>();
		for (const test of tests) {
			//read the test file from server
			const fileName = test.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
			const filePath = path.join(testsPath, `${fileName}.spec.ts`);

			const testCode = fs.readFileSync(filePath, 'utf-8');
			testCodeMap.set(test.id, testCode);
		}
		let index = 0;
		for (const flowTest of flow.flowTests) {
			const testCode = testCodeMap.get(flowTest.test.id)!;
			const pageReferences = testCode.match(/page\d+/g) || [];

			let updatedTestCode = testCode;
			const uniquePageRefs = new Map<string, string>();
			for (const pageRef of pageReferences) {
				if (!uniquePageRefs.has(pageRef)) {
					const uniquePageRef = `page_${uuidv4().replace(/-/g, '').slice(0, 10)}`;
					uniquePageRefs.set(pageRef, uniquePageRef);
				}
				const regex = new RegExp(pageRef, 'g');
				updatedTestCode = updatedTestCode.replace(regex, uniquePageRefs.get(pageRef)!);
			}

			const startIndex = updatedTestCode.indexOf('=> {') + 4;
			const endIndex = updatedTestCode.lastIndexOf('}') - 1;
			const slicedCode = updatedTestCode.slice(startIndex, endIndex).trim();

			//check the nextSliceCode code for page.goto and replace it with page.waitForURL
			//ensure this only happens in the first line never the first index
			if (index > 0) {
				const pageGotoIndex = slicedCode.indexOf('page.goto');
				const isFirstLineEnd = slicedCode.indexOf('\n');

				if (pageGotoIndex && isFirstLineEnd && pageGotoIndex < isFirstLineEnd) {
					// const firstLine = slicedCode.slice(0, isFirstLineEnd);
					const restOfCode = slicedCode.slice(isFirstLineEnd + 1);
					//replace page.goto with page.waitForURL
					// const newFirstLine = firstLine.replace('page.goto', 'page.waitForURL');
					compiledCode += wrapTestCodeInTryCatch(flowTest, restOfCode) + '\n';
				} else {
					compiledCode += wrapTestCodeInTryCatch(flowTest, slicedCode) + '\n';
				}
			} else {
				compiledCode += wrapTestCodeInTryCatch(flowTest, slicedCode) + '\n';
			}

			index++;
		}

		compiledCode += '});\n';
		return compiledCode;
	}

	static buildFlowRunResult(stdout: string, stderr: string, flow: Flow): FlowRunResult {
		// extract the results of the test from stdOut
		const executeRegex = /EXECUTING_FLOW_TEST_ID:(\d+)/g;
		const results: FlowRunResult = {
			success: true,
			flowTestResults: [],
		};

		const allFlowTests: FlowTestRunResult[] = [];
		for (const flowTest of flow.flowTests) {
			allFlowTests.push({
				testId: flowTest.test.id,
				flowTestId: flowTest.id,
				error: null,
				success: false,
			});
		}

		let match;
		while ((match = executeRegex.exec(stdout)) !== null) {
			const flowTestId = parseInt(match[1]);
			const flowTest = flow.flowTests.find((t) => t.id === flowTestId);

			if (!flowTest) throw new Error(`Flow test with id ${flowTestId} not found in flow ${flow.name}`);
			// console.log(match[1]);
			// console.log(match[2]);
			// console.log(stdout)

			// console.log(`TEST_ID:${flowTest.test.id}`);
			const testRan = stdout.includes(`SUCCESSFUL_FLOW_TEST_EXECUTION:${flowTest.id}`);
			const testFailed = stdout.includes(`FAILED_FLOW_TEST_EXECUTION:${flowTest.id}`);

			const flowTestResult = allFlowTests.find((t) => t.flowTestId === flowTest.id);
			if (!flowTestResult)
				throw new Error(`Flow test result with id ${flowTest.id} not found in flow ${flow.name}`);

			flowTestResult.success = testRan;
			flowTestResult.error = testFailed ? stderr : null;
		}

		results.success = allFlowTests.every((t) => t.success);
		results.flowTestResults = allFlowTests;
		return results;
	}

	//MODULE EXPORT ATTEMPT
	// static compileFlow(flow: Flow): string {
	// 	const testsPath = path.join(__dirname, '../../../recordings');

	// 	let compiledCode = `module.exports = async (page, expect) => {`;

	// 	const tests = flow.flowTests.map((f) => f.test);
	// 	const testCodeMap = new Map<number, string>();

	// 	for (const test of tests) {
	// 		const fileName = test.name.trim().replace(/[^a-zA-Z0-9-_.]/g, '');
	// 		const filePath = path.join(testsPath, `${fileName}.spec.ts`);
	// 		const testCode = fs.readFileSync(filePath, 'utf-8');
	// 		testCodeMap.set(test.id, testCode);
	// 	}

	// 	let index = 0;
	// 	for (const flowTest of flow.flowTests) {
	// 		const testCode = testCodeMap.get(flowTest.test.id)!;
	// 		const pageReferences = testCode.match(/page\d+/g) || [];

	// 		let updatedTestCode = testCode;
	// 		const uniquePageRefs = new Map<string, string>();
	// 		for (const pageRef of pageReferences) {
	// 			if (!uniquePageRefs.has(pageRef)) {
	// 				const uniquePageRef = `page_${uuidv4().replace(/-/g, '').slice(0, 10)}`;
	// 				uniquePageRefs.set(pageRef, uniquePageRef);
	// 			}
	// 			const regex = new RegExp(pageRef, 'g');
	// 			updatedTestCode = updatedTestCode.replace(regex, uniquePageRefs.get(pageRef)!);
	// 		}

	// 		const startIndex = updatedTestCode.indexOf('=> {') + 4;
	// 		const endIndex = updatedTestCode.lastIndexOf('}') - 1;
	// 		const slicedCode = updatedTestCode.slice(startIndex, endIndex).trim();

	// 		if (index > 0) {
	// 			const pageGotoIndex = slicedCode.indexOf('page.goto');
	// 			const isFirstLineEnd = slicedCode.indexOf('\n');

	// 			if (pageGotoIndex && isFirstLineEnd && pageGotoIndex < isFirstLineEnd) {
	// 				const restOfCode = slicedCode.slice(isFirstLineEnd + 1);
	// 				compiledCode += restOfCode + '\n';
	// 			} else {
	// 				compiledCode += slicedCode + '\n';
	// 			}
	// 		} else {
	// 			compiledCode += slicedCode + '\n';
	// 		}

	// 		index++;
	// 	}

	// 	compiledCode += '};';
	// 	return compiledCode;
	// }
}
