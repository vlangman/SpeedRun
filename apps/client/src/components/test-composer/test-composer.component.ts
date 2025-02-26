import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem } from '@angular/cdk/drag-drop';
import { Flow, Test } from '@shared';
import { TestListItemComponent } from '../test-list-item/test-list-item.component';
import { FlowTest } from 'libs/shared/src/lib/entities/flow-test';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMinusCircle } from '@ng-icons/heroicons/outline';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-test-composer',
	imports: [CommonModule, FormsModule, DragDropModule, TestListItemComponent,NgIcon],
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
	dragging = false;



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
