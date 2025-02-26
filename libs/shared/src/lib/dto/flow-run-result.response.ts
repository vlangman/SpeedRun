export interface FlowRunResult {
    success: boolean;
    testResults: {
        testId: number;
        success: boolean;
        error: string | null;
    }[]
}