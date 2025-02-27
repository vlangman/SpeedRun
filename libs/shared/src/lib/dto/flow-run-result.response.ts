export interface FlowRunResult {
	success: boolean;
	flowTestResults: FlowTestRunResult[];
}

export interface FlowTestRunResult {
	testId: number;
	flowTestId: number;
	success: boolean;
	error: string | null;
}
