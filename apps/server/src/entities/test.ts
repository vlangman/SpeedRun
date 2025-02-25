import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Test as TestInterface } from '@shared';
import { FlowTest } from './flow-test';

@Entity()
export class Test implements TestInterface {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@Column()
	description: string;

	@OneToMany(() => FlowTest, (flowTest) => flowTest.test)
	flowTests: FlowTest[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column()
	startUrl: string;

	@Column()
	endUrl: string;
}
