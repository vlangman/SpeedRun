import { Chain } from "./chain";
import { Flow } from "./flow";

export interface ChainFlow {
    id: number;
    flow: Flow;
    chain: Chain;
    order: number;
}