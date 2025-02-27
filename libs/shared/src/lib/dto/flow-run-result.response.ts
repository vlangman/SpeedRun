export interface FlowRunResult {
	success: boolean;
	flowTestResults: FlowTestRunResult[];
}

export interface FlowTestRunResult {
	testId: number;
	flowId: number;
	success: boolean;
	error: string | null;
}
