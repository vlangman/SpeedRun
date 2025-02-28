import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowTestRunResult, Test } from '@shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';

import { TestManagerService } from '../../services/test-manager.service';
import { ToastService } from '../../services/toast-service';

@Component({
	selector: 'app-test-list-item',
	imports: [CommonModule, DragDropModule],
	templateUrl: './test-list-item.component.html',
	styleUrl: './test-list-item.component.css',
})
export class TestListItemComponent {
	@Input() test!: Test;
	@Input() hideDelete: boolean = false;
	@Input() status: 'success' | 'failure' | 'warning' | 'pending' = 'pending';
	@Input() flowTestId: number | null = null;

	@Output() deleteTest: Subject<Test> = new EventEmitter<Test>();
	@Output() recordTest: Subject<Test> = new EventEmitter<Test>();
	@Output() clicked = new EventEmitter<Test>();

	@ViewChild('confirmDeleteModal', { static: true }) confirmDeleteModal!: ElementRef<any>;
	@ViewChild('recordTestModal', { static: true }) recordTestModal!: ElementRef<any>;


	constructor(private apiService: ApiService, private toastService: ToastService, public testManager: TestManagerService) {}



	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
	}

	playTest(test: Test) {
		this.apiService.executeTest(test.id).subscribe((response) => {
			console.log(response);
		});
	}

	confirmRecordTest(test: Test) {
		this.recordTest.next(test);
		this.recordTestModal.nativeElement.close();
	}

	showRecordTestModal() {
		console.log(this.recordTestModal);
		this.recordTestModal.nativeElement.showModal();
	}

	showDeleteModal() {
		console.log(this.confirmDeleteModal);
		this.confirmDeleteModal.nativeElement.showModal();
	}

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
