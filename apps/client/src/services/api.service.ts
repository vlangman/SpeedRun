import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AbstractHttpService } from './abstract-http.service';
import { AuthenticationService } from './authentication.service';
import { LoaderService } from './loader.service';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import { Flow, FlowRunResult, Test } from '@shared';
import { ToastService } from './toast-service';

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

	// Start recording
	// startCodegen(url: string, testName: string): Observable<{ testFile: string }> {
	// 	return this.POST<{ testFile: string }>({
	// 		endpoint: '/tests/start-codegen',
	// 		body: { url, testName },
	// 	}).pipe(this.Execute());
	// }

	// Add a new test
	addTest(name: string, description: string, url: string): Observable<Test> {
		return this.POST<Test>({
			endpoint: '/tests',
			body: { name, description, url },
		}).pipe(this.Execute());
	}

	// Delete a test
	deleteTest(id: number): Observable<null> {
		return this.DELETE<null>({
			endpoint: `/tests/${id}`,
		}).pipe(this.Execute());
	}

	// Create a new test flow
	createFlow(flowName: string, description: string): Observable<Flow> {
		return this.POST<Flow>({
			endpoint: '/flows',
			body: { flowName, description },
		}).pipe(this.Execute());
	}

	updateFlow(flow: Flow) {
		return this.PUT<Flow>({
			endpoint: '/flows',
			body: flow,
		}).pipe(this.Execute());
	}

	// Get all flows
	getAllFlows(): Observable<Flow[]> {
		return this.GET<Flow[]>({
			endpoint: '/flows',
		}).pipe(this.Execute());
	}

	// // Execute a flow
	// executeFlow(id: number): Observable<{ results: any[] }> {
	// 	return this.POST<{ results: any[] }>({
	// 		endpoint: `/flows/execute/${id}`,
	// 	}).pipe(this.Execute());
	// }

	// test a flows test execution before saving it
	testFlow(flow: Flow): Observable<FlowRunResult> {
		return this.POST<FlowRunResult>({
			endpoint: '/flows/test',
			body: { flow },
		}).pipe(this.Execute());
	}

	saveTestCode(testId: number, code: string): Observable<Test> {
		return this.PUT<Test>({
			endpoint: '/tests/code',
			body: {
				id: testId,
				code: code,
			},
		}).pipe(this.Execute());
	}

	executeTest(testId: number): Observable<{ results: any[] }> {
		return this.POST<{ results: any[] }>({
			endpoint: '/tests/execute',
			body: { id: testId },
		}).pipe(this.Execute());
	}

	startRecording(testId: number): Observable<Test> {
		return this.POST<Test>({
			endpoint: '/tests/record',
			body: { id: testId },
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
								duration: 5000
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
								duration: 5000
							});
						}
					} else if (error instanceof Error && !options?.hideErrorToast) {
						this.toast.openToast({
							message: error.message,
							type: 'error',
							dismissible: true,
							duration: 5000,
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
