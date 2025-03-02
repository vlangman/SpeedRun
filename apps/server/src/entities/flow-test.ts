import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Flow } from './flow';
import { Test } from './test';

@Entity()
export class FlowTest {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Flow, (flow) => flow.flowTests)
	flow: Flow;

	@ManyToOne(() => Test)
	test: Test;

	@Column()
	order: number;


	@Column()
	forceGoto: boolean;

}
