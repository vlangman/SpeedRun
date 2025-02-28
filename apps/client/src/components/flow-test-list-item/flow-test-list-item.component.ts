import { Component, computed, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { TestManagerService } from '../../services/test-manager.service';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastService } from '../../services/toast-service';

@Component({
	selector: 'app-flow-test-list-item',
	imports: [CommonModule, DragDropModule],
	templateUrl: './flow-test-list-item.component.html',
	styleUrl: './flow-test-list-item.component.css',
})
export class FlowTestListItemComponent {
	@Input({ required: true }) flowTest!: FlowTest;
	@Input() showLinkWarning: boolean = false;

	@Input() hideDelete: boolean = false;

	// @Output() deleteTest: Subject<Test> = new EventEmitter<Test>();
	// @Output() recordTest: Subject<Test> = new EventEmitter<Test>();
	@Output() clicked = new EventEmitter<FlowTest>();

	recomputeHistoryTrigger = signal(0);

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes)
		if (changes['flowTest']) {
			this.recomputeHistoryTrigger.update((t) => t++);
		}
	}


	constructor(private toastService: ToastService, public testManager: TestManagerService) {}

	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
	}

	// playTest(test: Test) {
	// 	this.apiService.executeTest(test.id).subscribe((response) => {
	// 		console.log(response);
	// 	});
	// }

	// confirmRecordTest(test: Test) {
	// 	this.recordTest.next(test);
	// 	this.recordTestModal.nativeElement.close();
	// }

	// showRecordTestModal() {
	// 	console.log(this.recordTestModal);
	// 	this.recordTestModal.nativeElement.showModal();
	// }

	// showDeleteModal() {
	// 	console.log(this.confirmDeleteModal);
	// 	this.confirmDeleteModal.nativeElement.showModal();
	// }

	copyText(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			console.log('Copied to clipboard');
		});

		this.toastService.openToast({
			message: 'Copied',
			type: 'success',
			duration: 2000,
		});
	}
}
