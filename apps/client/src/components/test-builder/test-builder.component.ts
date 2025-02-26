import { Component, computed, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { Flow, Test } from '@shared';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestComposerComponent } from '../test-composer/test-composer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestListItemComponent } from "../test-list-item/test-list-item.component";
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { FlowListItemComponent } from "../flow-list-item/flow-list-item.component";

@Component({
	selector: 'app-test-builder',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TestComposerComponent, DragDropModule, TestListItemComponent, FlowListItemComponent],
	templateUrl: './test-builder.component.html',
	styleUrls: ['./test-builder.component.css'],
})
export class TestBuilderComponent {
	allTests: WritableSignal<Test[]> = signal([]);
	allFlows: WritableSignal<Flow[]> = signal([]);


	testFlows = computed(()=>{
		const tests = this.allTests();

		return tests.map(test => {
			const flowTest : Omit<FlowTest,"flow" | "id"> = {
				test,
				order: 0,
				forceGoto: false,
				openInNewTab: false,
				openInNewWindow: false,
			}
			return flowTest;
		});
	})
	selectedFlow: Flow | null = null;

	newTestForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
		url: new FormControl(''),
	});

	newFlowForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	private destroyed = new Subject<void>();
	private initialIndex: number | null = null;

	constructor(private apiService: ApiService) {
		this.newTestForm.markAsPristine();
		this.newTestForm.markAsUntouched();

		this.apiService
			.getAllTests()
			.pipe(takeUntil(this.destroyed))
			.subscribe((response) => {
				console.log(response);
				this.allTests.set(response);
			});

		this.apiService
			.getAllFlows()
			.pipe(takeUntil(this.destroyed))
			.subscribe((response) => {
				console.log(response);
				this.allFlows.set(response);
			});
	}

	createNewTest() {
		const newTest = this.newTestForm.getRawValue();
		this.apiService.addTest(newTest.name, newTest.description, newTest.url).subscribe((response) => {
			console.log(response);
			this.allTests.update((tests) => {
				tests.push(response);
				return tests;
			});
		});
	}

	createNewFlow() {
		const newFlow = this.newFlowForm.getRawValue();
		this.apiService.createFlow(newFlow.name, newFlow.description).subscribe((response) => {
			console.log(response);
			this.allFlows.update((flows) => {
				flows.push(response);
				return flows;
			});
		});
	}


	runFlow() {
		this.apiService.testFlow(this.selectedFlow!)
		.pipe(
			catchError((error) => {
				console.error('Failed to run flow', error);
				return of(null);
			})
		)
		.subscribe(
			(response) => {
				console.log(response);
			},
		)
		
	}

	startTestRecording(test: Test) {
		this.apiService.startRecording(test.id).subscribe((response) => {
			console.log(response);
		});


	};

	deleteTest(test: Test) {
		this.apiService.deleteTest(test.id).subscribe((response) => {
			console.log(response);
			this.allTests.update((tests) => {
				return tests.filter((t) => t.id !== test.id);
			});
		});
	}

	saveFlow()
	{
		this.apiService.updateFlow(this.selectedFlow!)
		.pipe(
			catchError((error) => {
				console.error('Failed to save flow', error);
				return of(null);
			})
		)
		.subscribe(
			(response) => {
				console.log(response);
			}
		);
	}


}
