import { Injectable, signal, WritableSignal } from '@angular/core';
import { Flow, FlowRunResult, FlowTestRunResult, Test } from '@shared';
import { ApiService } from './api.service';
import { catchError, of } from 'rxjs';

export interface TestRunHistory {
	test: Test;
	result: string;
}

@Injectable()
export class TestManagerService {
	selectedTest: Test | null = null;
    //flowTestId to FlowRunResult
	flowTestRunHistory: WritableSignal<Record<number, FlowTestRunResult>> = signal({});

	allTests: WritableSignal<Test[]> = signal([]);
	allFlows: WritableSignal<Flow[]> = signal([]);

	constructor(private apiService: ApiService) {
		(window as any).testManager = this;
		this.loadData();
	}

	loadData() {
		this.apiService.getAllTests().subscribe((tests) => {
			this.allTests.set(tests);
		});

		this.apiService.getAllFlows().subscribe((flows) => {
			this.allFlows.set(flows);
		});
	}


    
}
