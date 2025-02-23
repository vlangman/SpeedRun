import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test } from '@shared';
import { CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-test-list-item',
	imports: [CommonModule,DragDropModule],
	templateUrl: './test-list-item.component.html',
	styleUrl: './test-list-item.component.css',
})
export class TestListItemComponent {
	@Input() test!: Test;

	constructor(private apiService: ApiService) {}

	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
	}

	recordTest(test:Test)
	{
		// this.apiService.startCodegen())
	}

	playTest(test:Test)
	{
		this.apiService.executeTest(test.id)
		.subscribe((response) => {
			console.log(response);
		});
	}
}
