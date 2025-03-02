import { Component, computed, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import { Flow} from '@shared';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMinusCircle } from '@ng-icons/heroicons/outline';

import { TestManagerService } from '../../services/test-manager.service';
import { FlowTestListItemComponent } from '../flow-test-list-item/flow-test-list-item.component';

@Component({
	selector: 'app-test-composer',
	imports: [CommonModule, FormsModule, DragDropModule, NgIcon, FlowTestListItemComponent],
	templateUrl: './test-composer.component.html',
	styleUrls: ['./test-composer.component.css'],
	providers: [
		provideIcons({
			heroMinusCircle,
		}),
	],
})
export class TestComposerComponent {
	@Input() flow!: Flow;
	dragging = false;

	flowStatusHistory = computed(() => {
		// get the status of all the flowtests in the flow
		const runHistory = this.testManager.flowTestRunHistory();
		const statusHistory: Record<string, 'success' | 'failure' | 'pending'> = {};
		for (const flowTest of this.flow.flowTests) {
			const runStatus = runHistory[this.flow.id][flowTest.test.id];
			if (!runStatus.success && !runStatus.error) {
				statusHistory[flowTest.id] = 'pending';
			} else if (runStatus.success) {
				statusHistory[flowTest.id] = 'success';
			} else {
				statusHistory[flowTest.id] = 'failure';
			}
		}
		return statusHistory;
	});
	
	constructor(public testManager: TestManagerService) {}

	drop(event: CdkDragDrop<FlowTest[]>): void {
		console.log(event);

		
		if (event.previousContainer === event.container) {
			//update the order of the flowTest
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
		//add the flow to the data of the flowTest
		const flowWithNoFlowTests = { ...this.flow };
		flowWithNoFlowTests.flowTests = [];
		event.container.data[event.currentIndex].flow = flowWithNoFlowTests;
		event.container.data.forEach((flowTest, index) => {
			flowTest.order = index;
		});
	}

	removeTest(flowTest: FlowTest) {
		const index = this.flow.flowTests.indexOf(flowTest);
		this.flow.flowTests.splice(index, 1);
	}

	isPrevFlowLinkValid(index: number): boolean {
		// check the start URL lines up with the endURL of the previous test
		if (index == 0) return true;
		if (!this.flow) return true;

		const flowTest = this.flow.flowTests[index];

		if (!flowTest.forceGoto && flowTest.test.startUrl != this.flow.flowTests[index - 1].test.endUrl)
			return false;

		return true;
	}
}
