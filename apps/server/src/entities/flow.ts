import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { Flow as FlowInterface } from '@shared';
import { FlowTest } from './flow-test';

@Entity()
export class Flow implements FlowInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => FlowTest, flowTest => flowTest.flow, { cascade: true })
  flowTests: FlowTest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}   