import { Injectable, signal, WritableSignal } from '@angular/core';

interface ToastBarConfig {
	message: string;
	type: 'info' | 'error' | 'success';
	duration: number;
	dismissible?: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class ToastService {
	public toasts: WritableSignal<ToastBarConfig[]> = signal([]);

	constructor() {
		// setTimeout(() => {
		// 	//create 3 toasts for testing info , error and success
		// 	this.showToastBar({ message: 'This is an info message', type: 'info', duration: 10000 , dismissible: true });
		// 	this.showToastBar({ message: 'This is an error message', type: 'error', duration: 2000 });
		// 	this.showToastBar({ message: 'This is a success message', type: 'success', duration: 13500 ,dismissible: true });
		// }, 1000);
	}

	openToast(config: ToastBarConfig) {
		const toasts = this.toasts();
		toasts.push(config);
		this.toasts.set(toasts);

		if (config.duration > 0) {
			setTimeout(() => {
				this.hide(config);
			}, config.duration);
		}
	}

	hide(Toast: ToastBarConfig) {
		const toasts = this.toasts();
		const index = toasts.findIndex((s) => s === Toast);
		toasts.splice(index, 1);
		this.toasts.set(toasts);
	}
}
