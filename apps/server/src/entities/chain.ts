import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { Chain as ChainInterface } from '@shared';
import { ChainFlow } from './chain-flow';

@Entity()
export class Chain implements ChainInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ChainFlow, chainFlow => chainFlow.chain, { cascade: true })
  chainFlows: ChainFlow[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}