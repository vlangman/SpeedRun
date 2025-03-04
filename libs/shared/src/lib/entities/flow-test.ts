import { Flow } from './flow';
import { Test } from './test';

export interface FlowTest {
	id: number;
	flow: Flow;
	test: Test;
	order: number;
	
	forceGoto: boolean;
	openInNewContext: boolean;
	config: {[key:string]: any};
}
