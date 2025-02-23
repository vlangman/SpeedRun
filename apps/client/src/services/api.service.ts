import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AbstractHttpService } from './abstract-http.service';
import { AuthenticationService } from './authentication.service';
import { LoaderService } from './loader.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Flow, Test } from '@shared';

export const APP_CONFIG: InjectionToken<any> = new InjectionToken('APP_CONFIG');

interface ApiResponse<T> {
	result: T;
	errors?: any[];
}

interface TestFlow {
	flowName: string;
	testNames: string[];
}

@Injectable()
export class ApiService extends AbstractHttpService {
	constructor(
		auth: AuthenticationService,
		private toast: ToastService,
		private loading: LoaderService,
		@Inject(APP_CONFIG) private config: any
	) {
		const api = config.apiUrl;
		super(api, auth, undefined);
	}

	// Get all available tests
	getAllTests(): Observable<Test[]> {
		return this.GET<Test[]>({
			endpoint: '/tests',
		}).pipe(this.Execute());
	}

	// Start recording a new test
	startCodegen(url: string, testName: string): Observable<{ testFile: string }> {
		return this.POST<{ testFile: string }>({
			endpoint: '/tests/start-codegen',
			body: { url, testName },
		}).pipe(this.Execute());
	}

	// Add a new test
	addTest(name: string, description: string): Observable<Test> {
		return this.POST<Test>({
			endpoint: '/tests',
			body: { name, description },
		}).pipe(this.Execute());
	}

	// Delete a test
	deleteTest(id: string): Observable<null> {
		return this.DELETE<null>({
			endpoint: `/tests/${id}`,
		}).pipe(this.Execute());
	}

	// Create a new test flow
	createFlow(flowName: string, testNames: string[]): Observable<Flow> {
		return this.POST<Flow>({
			endpoint: '/flows',
			body: { flowName, testNames },
		}).pipe(this.Execute());
	}

	// Get all flows
	getAllFlows(): Observable<Flow[]> {
		return this.GET<Flow[]>({
			endpoint: '/flows',
		}).pipe(this.Execute());
	}

	// Execute a flow
	executeFlow(flowName: string): Observable<{ results: any[] }> {
		return this.POST<{ results: any[] }>({
			endpoint: '/flows/execute',
			body: { flowName },
		}).pipe(this.Execute());
	}

	//UTILS
	private Execute<Response>(options?: { showLoader: boolean; hideErrorToast?: boolean; returnResponse?: boolean }) {
		// add a loader before the request is made
		// remove the loader after the request is made
		// if the request fails, throw a toast with this.handleErrorPipe
		return (source: Observable<Response>) => {
			if ((options && options?.showLoader) || !options) this.loading.addLoader();
			return source.pipe(
				tap(() => {
					this.loading.removeLoader();
				}),
				this.MapApiResponse<Response>(options)
			);
		};
	}

	private ExecuteSilent<Response>(options?: { hideErrorToast?: boolean; returnResponse?: boolean }) {
		// execute without a loader
		// if the request fails, throw a toast with this.handleErrorPipe
		return (source: Observable<Response>) => {
			return source.pipe(this.MapApiSilentResponse<Response>(options));
		};
	}

	private MapApiSilentResponse<T>(options?: { hideErrorToast?: boolean; returnResponse?: boolean }) {
		return (source: Observable<any>) => {
			this.loading.addLoader();
			return source.pipe(
				catchError((error: any) => {
					console.error(error);
					this.loading.removeLoader();
					return throwError(() => error);
				}),
				tap(() => {
					this.loading.removeLoader();
				}),
				// if the response has errors, throw a toast for each error
				map((event: ApiResponse<T>) => {
					if (event.errors?.length && !options?.hideErrorToast) {
						event.errors.forEach((error: any) => {
							this.toast.openToast({
								message: error.message,
								type: 'error',
								dismissible: true,
								duration: 5000,
								icon: 'icons/close-circle.svg',
							});
							throwError(() => error);
						});
					}

					// if we ever need to return the savvy response for batch results and display, we can do so here
					if (options?.returnResponse) return event as T;

					return event.result;
				})
			);
		};
	}

	private MapApiResponse<T>(options?: { showLoader: boolean; hideErrorToast?: boolean; returnResponse?: boolean }) {
		return (source: Observable<any>) => {
			return source.pipe(
				// try catch the error if it is an http error and throw a toast and throw the error again
				catchError((error) => {
					console.log(error);
					this.loading.removeLoader();
					if (error instanceof HttpErrorResponse) {
						if (!options?.hideErrorToast) {
							// check if the error is api response else use error message else use default message
							let message = error.error?.errors ? error.error.errors[0].message : error.message;
							if (!message) message = 'Something went wrong, please try again later';

							this.toast.openToast({
								message: message,
								type: 'error',
								dismissible: true,
								duration: 5000,
								icon: 'icons/close-circle.svg',
							});
						}
					} else if (error instanceof Error && !options?.hideErrorToast) {
						this.toast.openToast({
							message: error.message,
							type: 'error',
							dismissible: true,
							duration: 5000,
							icon: 'icons/close-circle.svg',
						});
					}
					return throwError(() => error);
				}),
				// if the response has errors, throw a toast for each error
				map((event: ApiResponse<T>) => {
					this.loading.removeLoader();
					if (event.errors?.length) {
						event.errors.forEach((error: any) => {
							if (!options?.hideErrorToast) {
								this.toast.openToast({
									message: error.message,
									type: 'error',
									dismissible: true,
									duration: 5000,
									icon: 'icons/close-circle.svg',
								});
							}
						});
					}

					// if we ever need to return the savvy response for batch results and display, we can do so here
					if (options?.returnResponse) return event as T;

					return event.result;
				})
			);
		};
	}
}
