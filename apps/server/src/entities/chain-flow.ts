import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Chain } from './chain';
import { Flow } from './flow';

@Entity()
export class ChainFlow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Chain, (chain) => chain.chainFlows)
    chain: Chain;

    @ManyToOne(() => Flow)
    flow: Flow;

    @Column()
    order: number;


}
