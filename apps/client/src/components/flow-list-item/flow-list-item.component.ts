import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flow, Test } from '@shared';
import { Subject } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-flow-list-item',
	imports: [CommonModule],
	templateUrl: './flow-list-item.component.html',
	styleUrl: './flow-list-item.component.css',
})
export class FlowListItemComponent {
		@Input() flow!: Flow;
		@Output() clicked = new EventEmitter<Flow>();
		@Output() deleteFlow: Subject<Test> = new EventEmitter<Test>();
		
		@ViewChild('confirmDeleteModal',{static:true}) confirmDeleteModal!: ElementRef<any>;
	
		constructor(private apiService: ApiService) {}
	
		dragEnded(event: any): void {
			console.log('drag ended', event);
			const draggedElement = event.source.element.nativeElement;
			draggedElement.style.transform = 'none';
		}
	
		playFlow(flow:Flow)
		{
			// this.apiService.executeFlow(flow.id)
			// .subscribe((response) => {
			// 	console.log(response);
			// });
		}
	
	
		showDeleteModal(){
			console.log(this.confirmDeleteModal);
			this.confirmDeleteModal.nativeElement.showModal();
		}
}
