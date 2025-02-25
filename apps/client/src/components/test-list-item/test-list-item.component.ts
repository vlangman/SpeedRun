import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Test } from '@shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-test-list-item',
	imports: [CommonModule,DragDropModule],
	templateUrl: './test-list-item.component.html',
	styleUrl: './test-list-item.component.css',
})
export class TestListItemComponent {
	@Input() test!: Test;
	@Output() deleteTest: Subject<Test> = new EventEmitter<Test>();
	@Output() recordTest: Subject<Test> = new EventEmitter<Test>();
	
	@ViewChild('confirmDeleteModal',{static:true}) confirmDeleteModal!: ElementRef<any>;

	constructor(private apiService: ApiService) {}

	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
	}

	playTest(test:Test)
	{
		this.apiService.executeTest(test.id)
		.subscribe((response) => {
			console.log(response);
		});
	}


	showDeleteModal(){
		console.log(this.confirmDeleteModal);
		this.confirmDeleteModal.nativeElement.showModal();
	}
	
}
