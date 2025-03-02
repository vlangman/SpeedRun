import { ChainFlow } from "./chain-flow";

export interface Chain{
    id: number;
    name: string;
    chainFlows: ChainFlow[];
    description: string;
    createdAt: Date;
	updatedAt: Date;
}