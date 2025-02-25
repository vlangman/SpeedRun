import { Flow } from './flow';
import { Test } from './test';

export interface FlowTest {
	id: number;
	flow: Flow;
	test: Test;
	order: number;
	
	forceGoto: boolean;
	openInNewTab: boolean;
	openInNewWindow: boolean;
}
