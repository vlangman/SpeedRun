import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chain } from '@shared';
import { Subject } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-chain-list-item',
	imports: [CommonModule],
	templateUrl: './chain-list-item.component.html',
	styleUrl: './chain-list-item.component.css',
})
export class ChainListItemComponent {
	@Input() chain!: Chain;
	@Output() clicked = new Subject<Chain>();
	@Output() deleteChain: Subject<Chain> = new Subject<Chain>();

	@ViewChild('confirmDeleteModal', { static: true }) confirmDeleteModal!: ElementRef<any>;

	constructor(private apiService: ApiService) {}

	dragEnded(event: any): void {
		console.log('drag ended', event);
		const draggedElement = event.source.element.nativeElement;
		draggedElement.style.transform = 'none';
	}

	playChain(flow: Chain) {
		// this.apiService.executeFlow(flow.id)
		// .subscribe((response) => {
		// 	console.log(response);
		// });
	}

	showDeleteModal() {
		console.log(this.confirmDeleteModal);
		this.confirmDeleteModal.nativeElement.showModal();
	}
}
