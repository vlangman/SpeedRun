import { Component, computed, effect, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { catchError, of } from 'rxjs';
import { Chain, ChainFlow, Flow, FlowRunResult, Test } from '@shared';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestComposerComponent } from '../test-composer/test-composer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TestListItemComponent } from '../test-list-item/test-list-item.component';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { FlowListItemComponent } from '../flow-list-item/flow-list-item.component';
import { TestManagerService } from '../../services/test-manager.service';
import { TestCodeEditorComponent } from '../test-code-editor/test-code-editor.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlayCircle } from '@ng-icons/heroicons/outline';
import { FlowComposerComponent } from '../flow-composer/flow-composer.component';
import { ChainListItemComponent } from '../chain-list-item/chain-list-item.component';

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
		TestCodeEditorComponent,
		ChainListItemComponent,
		NgIcon,
		FlowComposerComponent,
	],
	providers: [
		provideIcons({
			heroPlayCircle,
		}),
	],
	templateUrl: './test-builder.component.html',
	styleUrls: ['./test-builder.component.css'],
})
export class TestBuilderComponent {
	//Iffy hack to get the AngularCDK Drag lists to be the same underlying type (under the hood its still a test
	// flow is rebound on drop() to the flowTests array)
	testFlows = computed(() => {
		const tests = this.testManager.allTests();

		return tests.map((test) => {
			const flowTest: Omit<FlowTest, 'flow' | 'id'> = {
				test,
				order: 0,
				forceGoto: false,
			};
			return flowTest;
		});
	});

	chainFlows = computed(() => {
		const flows = this.testManager.allFlows();

		return flows.map((flow) => {
			const flowTest: Omit<ChainFlow, 'chain' | 'id'> = {
				flow,
				order: 0,
			};
			return flowTest;
		});
	});

	selectedFlow: Flow | null = null;
	originalFlowTests: FlowTest[] = [];
	selectedTest: Test | null = null;

	selectedChain: Chain | null = null;

	newTestForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
		url: new FormControl(''),
	});

	newFlowForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	newChainForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	@ViewChild('confirmCancelModal', { static: true }) confirmCancelModal!: ElementRef<any>;

	constructor(private apiService: ApiService, public testManager: TestManagerService) {
		this.newTestForm.markAsPristine();
		this.newTestForm.markAsUntouched();

		effect(() => {
			const allFlows = this.testManager.allFlows();
			if (!this.selectedFlow && allFlows.length) {
				//choose the first
				this.selectedFlow = allFlows[0];
				this.originalFlowTests = [...allFlows[0].flowTests];
			}
		});
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

	createNewChain() {
		const newChain = this.newChainForm.getRawValue();
		this.apiService.createChain(newChain.name, newChain.description).subscribe((response) => {
			console.log(response);
			this.testManager.allChains.update((chains) => {
				chains.push(response);
				return chains;
			});
		});
	}

	runFlow() {
		console.log(this.selectedFlow);
		this.testManager.testFlow(this.selectedFlow!).subscribe((response) => {
			console.log(response);
		});
	}

	saveChain() {
		this.apiService.updateChain(this.selectedChain!).subscribe((response) => {
			console.log(response);
		});
	}

	runChain() {
		console.log(this.selectedChain);
		this.testManager.testChain(this.selectedChain!).subscribe((response) => {
			console.log(response);
		});
	}

	selectFlow(flow: Flow) {
		console.log(flow);
		this.selectedTest = null;
		this.selectedChain = null;
		this.selectedFlow = flow;
		this.originalFlowTests = [...flow.flowTests];
	}

	selectChain(chain: Chain) {
		this.selectedChain = chain;
		this.selectedFlow = null;
		this.originalFlowTests = [];
		this.selectedTest = null;
	}

	selectTest(test: Test) {
		this.selectedFlow = null;
		this.originalFlowTests = [];
		this.selectedChain = null;
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

	cancelFlowChanges() {
		console.log('Cancelling changes');
		console.log(this.selectedFlow);
		console.log(this.originalFlowTests);

		this.selectedFlow!.flowTests = [...this.originalFlowTests];

		this.confirmCancelModal.nativeElement.close();
	}
}
