import { Test } from './test';

export interface Flow {
	id: number;
	name: string;
	description: string;
	tests: Test[];
	createdAt: Date;
	updatedAt: Date;
}
