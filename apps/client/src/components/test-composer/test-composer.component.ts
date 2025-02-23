import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Flow, Test } from '@shared';
import { TestListItemComponent } from '../test-list-item/test-list-item.component';

@Component({
	selector: 'app-test-composer',
	imports: [CommonModule, FormsModule, DragDropModule, TestListItemComponent],
	templateUrl: './test-composer.component.html',
	styleUrls: ['./test-composer.component.css'],
})
export class TestComposerComponent {
	@Input() flow!: Flow;
	dragging = false;

	drop(event: CdkDragDrop<Test[]>): void {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			const item = event.previousContainer.data[event.previousIndex];
			event.container.data.splice(event.currentIndex, 0, item);
		}
	}
}
