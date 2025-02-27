import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import { Flow, FlowRunResult, Test } from '@shared';
import { TestListItemComponent } from '../test-list-item/test-list-item.component';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMinusCircle } from '@ng-icons/heroicons/outline';

import { TestManagerService } from '../../services/test-manager.service';
import { FlowTestListItemComponent } from "../flow-test-list-item/flow-test-list-item.component";

@Component({
	selector: 'app-test-composer',
	imports: [CommonModule, FormsModule, DragDropModule, TestListItemComponent, NgIcon, FlowTestListItemComponent],
	templateUrl: './test-composer.component.html',
	styleUrls: ['./test-composer.component.css'],
	providers:[
		provideIcons({
			heroMinusCircle
		})
	]
})
export class TestComposerComponent {
	@Input() flow!: Flow;
	@Input() flowRunResult: FlowRunResult | null = null;
	dragging = false;

	flowRunStatusMap: Record<number,Record<number,'success' | 'failure' | 'warning' | 'pending'>> = {};

	constructor(public testManager: TestManagerService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes['flowRunResult'])
		{
			this.flowRunResult = changes['flowRunResult'].currentValue;
			this.flowRunResult?.flowTestResults.forEach((flowTestResult) => {

				if(!this.flowRunStatusMap[flowTestResult.flowId])
				{
					this.flowRunStatusMap[flowTestResult.flowId] = {};
				}

				
				if(!flowTestResult.success && !flowTestResult.error)
				{
					this.flowRunStatusMap[flowTestResult.flowId][flowTestResult.testId] = 'pending';
				}
				else if(flowTestResult.success)
				{
					this.flowRunStatusMap[flowTestResult.flowId][flowTestResult.testId] = 'success';
				}else{
					this.flowRunStatusMap[flowTestResult.flowId][flowTestResult.testId] = 'failure';
				}

			});
		}
	}

	drop(event: CdkDragDrop<FlowTest[]>): void {
		console.log(event);

		if (event.previousContainer === event.container) {
			//update the order of the flowTest
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
		event.container.data.forEach((flowTest, index) => {
			flowTest.order = index;
		});
	}

	removeTest(flowTest: FlowTest){
		const index = this.flow.flowTests.indexOf(flowTest);
		this.flow.flowTests.splice(index, 1);
	}

}
