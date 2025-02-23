import {
	Injectable,
	ComponentFactoryResolver,
	ApplicationRef,
	Injector,
} from '@angular/core';
import { FullscreenLoadingComponent } from '../components/fullscreen-loading/fullscreen-loading.component';

export class SavvyLoadingConfig {
	showBackdrop: boolean = true;
	spinner:
		| 'dots'
		| 'lines'
		| 'bubbles'
		| 'circles'
		| 'crescent'
		| 'circular'
		| 'crescent'
		| 'dots'
		| 'lines' = 'dots';
	message?: string;
	cssClass?: string;
	timeout?: {
		errorMessage: string;
		duration: number;
	};
}

@Injectable()
export class LoaderService {
	private _loadingStack = 0;
	private loadingComponentRef: any;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector
	) {}

	public addLoader() {
		this._loadingStack += 1;
		if (this._loadingStack == 1) {
			this.show({
				showBackdrop: true,
				spinner: 'circles',
				cssClass: 'savvy-loader',
				message: 'Loading...',
			});
		}
	}

	public removeLoader() {
		this._loadingStack -= 1;
		if (this._loadingStack <= 0) {
			this._loadingStack = 0;
			this.hide();
		}
	}

	public killLoader() {
		this._loadingStack = 0;
		this.hide();
	}

	public show(config: SavvyLoadingConfig) {
		const { message, timeout } = config;

		const componentFactory =
			this.componentFactoryResolver.resolveComponentFactory(
				FullscreenLoadingComponent
			);
		this.loadingComponentRef = componentFactory.create(this.injector);
		this.loadingComponentRef.instance.message = message || 'Loading...';

		this.appRef.attachView(this.loadingComponentRef.hostView);
		const domElem = (this.loadingComponentRef.hostView as any)
			.rootNodes[0] as HTMLElement;
		document.body.appendChild(domElem);

		if (timeout) {
			setTimeout(() => {
				if (!this.loadingComponentRef) {
					return;
				}
				this.hide();
				this.show({
					showBackdrop: true,
					spinner: 'circles',
					message: timeout.errorMessage,
					cssClass: 'savvy-loader-error',
				});

				setTimeout(() => {
					this.hide();
				}, timeout.duration - 100);
			}, timeout.duration);
		}
	}

	public hide() {
		if (this.loadingComponentRef) {
			this.appRef.detachView(this.loadingComponentRef.hostView);
			this.loadingComponentRef.destroy();
			this.loadingComponentRef = null;
		}
	}
}
