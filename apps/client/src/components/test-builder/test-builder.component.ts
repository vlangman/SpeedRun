import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Flow, Test } from '@shared';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TestComposerComponent } from '../test-composer/test-composer.component';
import { CdkDragStart, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TestListItemComponent } from "../test-list-item/test-list-item.component";

@Component({
	selector: 'app-test-builder',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TestComposerComponent, DragDropModule, TestListItemComponent],
	templateUrl: './test-builder.component.html',
	styleUrls: ['./test-builder.component.css'],
})
export class TestBuilderComponent {
	allTests: WritableSignal<Test[]> = signal([]);
	allFlows: WritableSignal<Flow[]> = signal([]);

	selectedFlow: Flow | null = null;

	newTestForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	newFlowForm: FormGroup = new FormGroup({
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
	});

	private destroyed = new Subject<void>();
	private initialIndex: number | null = null;

	constructor(private apiService: ApiService) {
		this.newTestForm.markAsPristine();
		this.newTestForm.markAsUntouched();

		this.apiService
			.getAllTests()
			.pipe(takeUntil(this.destroyed))
			.subscribe((response) => {
				console.log(response);
				this.allTests.set(response);
			});

		this.apiService
			.getAllFlows()
			.pipe(takeUntil(this.destroyed))
			.subscribe((response) => {
				console.log(response);
				this.allFlows.set(response);
			});
	}

	createNewTest() {
		const newTest = this.newTestForm.getRawValue();
		this.apiService.addTest(newTest.name, newTest.description).subscribe((response) => {
			console.log(response);
			this.allTests.update((tests) => {
				tests.push(response);
				return tests;
			});
		});
	}

	createNewFlow() {
		const newFlow = this.newFlowForm.getRawValue();
		this.apiService.createFlow(newFlow.name, newFlow.description).subscribe((response) => {
			console.log(response);
			this.allFlows.update((flows) => {
				flows.push(response);
				return flows;
			});
		});
	}


}
