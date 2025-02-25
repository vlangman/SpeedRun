import path from 'path';
import { Flow } from './entities/flow';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class FlowFactory {
	static compileFlow(flow: Flow): string {
		const testsPath = path.join(__dirname, '../../../recordings');

		let compiledCode =
			'(async () => {\nconst browser = await chromium.launch({ headless: false });\nconst page = await browser.newPage();\n';

		const tests = flow.flowTests.map((f) => f.test);
		const testCodeMap = new Map<number, string>();
		for (const test of tests) {
			//read the test file from server
			const testCode = fs.readFileSync(path.join(testsPath, `${test.name}.spec.ts`), 'utf-8');
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
					compiledCode +=  restOfCode + '\n';
				} else {
					compiledCode += slicedCode + '\n';
				}
			} else {
				compiledCode += slicedCode + '\n';
			}

			index++;
		}
		
		compiledCode += 'await browser.close();\n})();\n';
		return compiledCode;
	}
}
