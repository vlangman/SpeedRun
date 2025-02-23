import { Component, Input } from '@angular/core';

@Component({
	selector: 'portal-fullscreen-loading',
	standalone: true,
	imports: [],
	templateUrl: './fullscreen-loading.component.html',
	styleUrl: './fullscreen-loading.component.css',
})
export class FullscreenLoadingComponent {
	@Input() message: string = 'Cooking...';
}
