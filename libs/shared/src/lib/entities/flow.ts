import { FlowTest } from './flow-test';


export interface Flow {
	id: number;
	name: string;
	description: string;
	flowTests: FlowTest[];
	createdAt: Date;
	updatedAt: Date;
}
