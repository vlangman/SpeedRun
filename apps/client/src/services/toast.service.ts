import { Injectable } from '@angular/core';

export interface ToastOptions {
	message: string;
	type: 'success' | 'error';
	duration?: number;
	header?: string;
	position?: 'top' | 'bottom' | 'middle';
	icon?: string;
	iconPosition?: 'start' | 'end';
	dismissible?: boolean;
}

@Injectable()
export class ToastService {
	constructor() {}

	openToast(toast: ToastOptions) {
		const { header, message, duration, type, position } = toast;
	}
}
