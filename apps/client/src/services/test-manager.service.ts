import { computed, effect, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Flow, FlowRunResult, FlowTestRunResult, Test } from '@shared';
import { ApiService } from './api.service';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';

export interface TestRunHistory {
	test: Test;
	result: string;
}

@Injectable()
export class TestManagerService {
	selectedTest: Test | null = null;

	//FlowID TO TestID to FlowRunResult
	flowTestRunHistory: Signal<Record<number, Record<number, FlowTestRunResult>>> = computed(() => {
		const allFlows = this.allFlows();
		const allTests = this.allTests();
		const recentRuns = this.runHistory();

		//first ensure we have a map of all flows to all tests
		const flowToTestMap: Record<number, Record<number, FlowTestRunResult>> = {};
		allFlows.forEach((flow) => {
			flowToTestMap[flow.id] = {};
			allTests.forEach((test) => {
				flowToTestMap[flow.id][test.id] = {
					error: null,
					flowId: flow.id,
					testId: test.id,
					success: false,
				};
			});
		});

		//add the recent history to the map
		recentRuns.forEach((run) => {
			flowToTestMap[run.flowId][run.testId] = run;
		});
		console.log('FLOW TO TEST MAP', flowToTestMap);
		return flowToTestMap;
	});

	private runHistory: WritableSignal<FlowTestRunResult[]> = signal([]);
	allTests: WritableSignal<Test[]> = signal([]);
	allFlows: WritableSignal<Flow[]> = signal([]);

	constructor(private apiService: ApiService) {
		(window as any).testManager = this;
		this.loadData();
	}

	loadData() {
		this.apiService
			.getAllTests()
			.pipe(
				switchMap((tests) => {
					return forkJoin([of(tests), this.apiService.getAllFlows()]);
				})
			)
			.subscribe((testAndFlows) => {
				const [tests, flows] = testAndFlows;
				this.allFlows.set(flows);
				this.allTests.set(tests);
			});
	}

	testFlow(flow: Flow) {
		return this.apiService.testFlow(flow).pipe(
			catchError((error) => {
				console.error('Failed to run flow', error);
				return of(null);
			}),
			tap((response) => {
				if (response) {
					this.runHistory.set([...response.flowTestResults]);
					console.log('CLEARING HISTORY');
				}
			})
		);
	}
}
