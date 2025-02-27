import { Component, computed, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { Flow, FlowRunResult, FlowTestRunResult, Test } from '@shared';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestComposerComponent } from '../test-composer/test-composer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestListItemComponent } from '../test-list-item/test-list-item.component';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { FlowListItemComponent } from '../flow-list-item/flow-list-item.component';
import { TestManagerService } from '../../services/test-manager.service';
import { TestCodeEditorComponent } from "../test-code-editor/test-code-editor.component";

@Component({
	selector: 'app-test-builder',
	imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TestComposerComponent,
    DragDropModule,
    TestListItemComponent,
    FlowListItemComponent,
    TestCodeEditorComponent
],
	templateUrl: './test-builder.component.html',
	styleUrls: ['./test-builder.component.css'],
})
export class TestBuilderComponent {
	//Iffy hack to get the AngularCDK Drag lists to be the same underlying type (under the hood its still a test)
	testFlows = computed(() => {
		const tests = this.testManager.allTests();

		return tests.map((test) => {
			const flowTest: Omit<FlowTest, 'flow' | 'id'> = {
				test,
				order: 0,
				forceGoto: false,
				openInNewTab: false,
				openInNewWindow: false,
			};
			return flowTest;
		});
	});
	selectedFlow: Flow | null = null;
	selectedTest: Test | null = null;
	selectedFlowRunResult: FlowRunResult | null = null;

	newTestForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
		url: new FormControl(''),
	});

	newFlowForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	constructor(private apiService: ApiService, public testManager: TestManagerService) {
		this.newTestForm.markAsPristine();
		this.newTestForm.markAsUntouched();
	}

	createNewTest() {
		const newTest = this.newTestForm.getRawValue();
		this.apiService.addTest(newTest.name, newTest.description, newTest.url).subscribe((response) => {
			console.log(response);
			this.testManager.allTests.update((tests) => {
				tests.push(response);
				return tests;
			});
		});
	}

	createNewFlow() {
		const newFlow = this.newFlowForm.getRawValue();
		this.apiService.createFlow(newFlow.name, newFlow.description).subscribe((response) => {
			console.log(response);
			this.testManager.allFlows.update((flows) => {
				flows.push(response);
				return flows;
			});
		});
	}

	runFlow() {
		console.log(this.selectedFlow)
		this.apiService
			.testFlow(this.selectedFlow!)
			.pipe(
				catchError((error) => {
					console.error('Failed to run flow', error);
					return of(null);
				})
			)
			.subscribe((response) => {
				console.log(response);
				if (response) {
					this.testManager.flowTestRunHistory.update((history) => {
						for (const result of response.flowTestResults) {
							if(!history[result.flowId]) {
								history[result.flowId] = {};
							}

							history[result.flowId][result.testId] = result;
						}
						return history;
					});
					this.selectedFlowRunResult = response;
				}
			});
	}

	selectFlow(flow: Flow) {
		this.selectedTest = null;
		this.selectedFlow = flow;
		this.selectedFlowRunResult = null;
	}

	selectTest(test: Test) {
		this.selectedFlow = null;
		this.selectedTest = test;
	}

	startTestRecording(test: Test) {
		this.apiService.startRecording(test.id).subscribe((response) => {
			console.log(response);
		});
	}

	deleteTest(test: Test) {
		this.apiService.deleteTest(test.id).subscribe((response) => {
			console.log(response);
			this.testManager.allTests.update((tests) => {
				return tests.filter((t) => t.id !== test.id);
			});
		});
	}

	saveFlow() {
		this.apiService
			.updateFlow(this.selectedFlow!)
			.pipe(
				catchError((error) => {
					console.error('Failed to save flow', error);
					return of(null);
				})
			)
			.subscribe((response) => {
				console.log(response);
			});
	}
}
