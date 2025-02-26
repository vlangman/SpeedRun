import path from 'path';
import { Flow } from './entities/flow';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FlowRunResult, Test } from '@shared';

export class FlowFactory {
	static compileFlow(flow: Flow): string {
		function wrapTestCodeInTryCatch(test: Test, testCode: string): string {
			return `
try {

	${testCode}

	console.log('SUCCESSFUL_TEST_EXECUTION:${test.id}');

} catch (error) {
	console.log('FAILED_TEST_EXECUTION:${test.id}');
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
					compiledCode += wrapTestCodeInTryCatch(flowTest.test, restOfCode) + '\n';
				} else {
					compiledCode += wrapTestCodeInTryCatch(flowTest.test, slicedCode) + '\n';
				}
			} else {
				compiledCode += wrapTestCodeInTryCatch(flowTest.test, slicedCode) + '\n';
			}

			index++;
		}

		compiledCode += '});\n';
		return compiledCode;
	}

	static buildFlowRunResult(stdout: string, stderr: string, flow: Flow): FlowRunResult {
		// extract the results of the test from stdOut
		const executeRegex = /EXECUTING_TEST_ID: (\d+)([\s\S]*?)(?=EXECUTING_TEST_ID: \d+|$)/g;
		const results: FlowRunResult = {
			success: true,
			testResults: [],
		};

		let match;
		while ((match = executeRegex.exec(stdout)) !== null) {
			const testId = parseInt(match[1]);
			const testResult = match[2];
			const test = flow.flowTests.find((t) => t.test.id === testId);
			if (test) {
				const testRan = testResult.includes(`SUCCESSFUL_TEST_EXECUTION:${test.id}`);
				const testFailed = testResult.includes(`FAILED_TEST_EXECUTION:${test.id}`);
				results.testResults.push({
					testId: test.test.id,
					error: testFailed ? stderr : null,
					success: !testFailed
				});
			}
		}
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
