import { Component, computed, EventEmitter, Input, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgIcon } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { ChainFlow } from '@shared';
import { TestManagerService } from '../../services/test-manager.service';

@Component({
	selector: 'app-chain-flow-list-item',
	imports: [CommonModule, DragDropModule, NgIcon, FormsModule],
	templateUrl: './chain-flow-list-item.component.html',
	styleUrl: './chain-flow-list-item.component.css',
})
export class ChainFlowListItemComponent {
	@Input({ required: true }) chainFlow!: ChainFlow;
	@Input() showLinkWarning: boolean = false;

	// @Output() deleteTest: Subject<Test> = new EventEmitter<Test>();
	// @Output() recordTest: Subject<Test> = new EventEmitter<Test>();
	@Output() clicked = new EventEmitter<ChainFlow>();


	ngOnChanges(changes: SimpleChanges)
	{
		console.log('changes', changes);
		if(changes['chainFlow'])
		{
			this.chainFlow = changes['chainFlow'].currentValue;
			this.recompute.update((v) => v + 1);
		}
	}

	private recompute: WritableSignal<number> = signal(0);
	chainFlowTestHistory = computed(() => {
		this.recompute()
		let succeeded = 0;
		let error = null;
		let success = false;
		let pending = true;

		let index = 1;
		for (const flowTest of this.chainFlow.flow.flowTests) {
			const flowRunHistory = this.testManager.flowTestRunHistory()[flowTest.flow.id];
			const testHistory = flowRunHistory[flowTest.test.id];

			if (testHistory && testHistory.success) {
				succeeded++;
			}

			if (testHistory && !testHistory.success && testHistory.error) {
				const failedOn = `FAILED ON TEST INDEX: ${index}`;
				error = testHistory.error + '\n' + failedOn;
				break;
			}
			index++;
		}

		if (succeeded === this.chainFlow.flow.flowTests.length) {
			success = true;
		}
		
		return {
			success,
			error,
			pending
		};
	});

	constructor(public testManager: TestManagerService) {}

	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
		this.recompute.update((v) => v + 1);
	}
}
