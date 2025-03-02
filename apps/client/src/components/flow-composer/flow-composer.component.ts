import { Component, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chain, ChainFlow } from '@shared';
import { TestManagerService } from '../../services/test-manager.service';
import { CdkDragDrop, copyArrayItem, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ChainFlowListItemComponent } from '../chain-flow-list-item/chain-flow-list-item.component';
import { heroMinusCircle } from '@ng-icons/heroicons/outline';

@Component({
	selector: 'app-flow-composer',
	imports: [CommonModule, FormsModule, DragDropModule, NgIcon, ChainFlowListItemComponent],
	providers: [
		provideIcons({
			heroMinusCircle,
		}),
	],
	templateUrl: './flow-composer.component.html',
	styleUrl: './flow-composer.component.css',
})
export class FlowComposerComponent {
	@Input() chain!: Chain;
	dragging = false;

	chainStatusHistory = computed(() => {
		// get the status of all the chainflows in the chain
		const runHistory = this.testManager.flowTestRunHistory();
		const statusHistory: Record<string, 'success' | 'failure' | 'pending'> = {};
		for (const chainFlow of this.chain.chainFlows) {
			const testsRun = Object.values(runHistory[chainFlow.flow.id]);
			const successCount = testsRun.filter((testRun) => testRun.success).length;
			const runStatus = successCount === chainFlow.flow.flowTests.length;
			// console.log('runStatus', runStatus);
			// console.log('successCount', successCount);
			// console.log('totalTests', chainFlow.flow.flowTests.length);
			if (runStatus) {
				statusHistory[chainFlow.id] = 'success';
			} else if (runStatus && successCount != chainFlow.flow.flowTests.length) {
				statusHistory[chainFlow.id] = 'failure';
			} else {
				statusHistory[chainFlow.id] = 'pending';
			}
		}
		return statusHistory;
	});

	constructor(public testManager: TestManagerService) {}

	drop(event: CdkDragDrop<ChainFlow[]>): void {
		console.log(event);

		if (event.previousContainer === event.container) {
			//update the order of the chainFlow
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			copyArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
		}
		//add the chain to the data of the chainFlow
		const chainWithNoChainFlows = { ...this.chain };
		chainWithNoChainFlows.chainFlows = [];
		event.container.data[event.currentIndex].chain = chainWithNoChainFlows;
		event.container.data.forEach((chainFlow, index) => {
			chainFlow.order = index;
		});
	}

	removeFlow(chainFlow: ChainFlow) {
		const index = this.chain.chainFlows.indexOf(chainFlow);
		this.chain.chainFlows.splice(index, 1);
	}
}
