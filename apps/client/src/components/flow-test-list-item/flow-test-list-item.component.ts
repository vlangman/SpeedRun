import { Component, computed, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { TestManagerService } from '../../services/test-manager.service';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ToastService } from '../../services/toast-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClipboard } from '@ng-icons/heroicons/outline';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-flow-test-list-item',
	imports: [CommonModule, DragDropModule,NgIcon, FormsModule],
	templateUrl: './flow-test-list-item.component.html',
	providers:[
		provideIcons({
			heroClipboard
		})
	],
	styleUrl: './flow-test-list-item.component.css',
})
export class FlowTestListItemComponent {
	@Input({ required: true }) flowTest!: FlowTest;
	@Input() showLinkWarning: boolean = false;

	@Input() hideDelete: boolean = false;

	// @Output() deleteTest: Subject<Test> = new EventEmitter<Test>();
	// @Output() recordTest: Subject<Test> = new EventEmitter<Test>();
	@Output() clicked = new EventEmitter<FlowTest>();


	constructor(private toastService: ToastService, public testManager: TestManagerService) {}

	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
	}

	toggleForceGoto() {
		this.flowTest.forceGoto = !this.flowTest.forceGoto;
	}

	toggleOpenInNewWindow() {
		this.flowTest.openInNewWindow = !this.flowTest.openInNewWindow;
	}

	copyText(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			console.log('Copied to clipboard');
		});

		this.toastService.openToast({
			message: `Copied ${text}`,
			type: 'success',
			duration: 2000,
		});
	}
}
