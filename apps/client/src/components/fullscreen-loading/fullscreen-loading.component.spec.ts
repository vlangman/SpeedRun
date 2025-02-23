import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenLoadingComponent } from './fullscreen-loading.component';

describe('FullscreenLoadingComponent', () => {
	let component: FullscreenLoadingComponent;
	let fixture: ComponentFixture<FullscreenLoadingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FullscreenLoadingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FullscreenLoadingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
