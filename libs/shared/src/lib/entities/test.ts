import { FlowTest } from "./flow-test";

export interface Test {
  id: number;
  name: string;
  description: string;
  flowTests: FlowTest[];
  createdAt: Date;
  updatedAt: Date;
}