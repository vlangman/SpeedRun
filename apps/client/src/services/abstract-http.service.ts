import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import {
	first,
	last,
	map,
	Observable,
	of,
	switchMap,
	tap,
	throwError,
	timeout,
} from 'rxjs';
import { AbstractAuthService } from './abstract-auth.service';
import { AbstractHttpRequest } from './abstract-http.request';
import { inject } from '@angular/core';

type RequestType = (typeof REQUEST_TYPES)[number];

const REQUEST_TYPES = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'] as const;

export class AbstractHttpService {
	baseHeaders?: HttpHeaders;
	url = '';
	private authenticator: AbstractAuthService;

	private httpClient: HttpClient = inject(HttpClient);

	constructor(
		private baseUrl: string,
		auth: AbstractAuthService,
		baseHeaders?: HttpHeaders
	) {
		this.baseHeaders = baseHeaders;
		this.url = baseUrl;
		this.authenticator = auth;
	}

	private BuildRequest(
		abstractRequest: AbstractHttpRequest,
		requestType: RequestType
	): Observable<HttpRequest<any>> {
		let url = this.baseUrl + abstractRequest.endpoint;
		if (abstractRequest.baseRef)
			url = abstractRequest.baseRef + abstractRequest.endpoint;

		if (abstractRequest.queryFilters)
			url += Object.keys(abstractRequest.queryFilters)
				.map(
					(q: string, i: number) =>
						`${i == 0 ? '?' : '&'}${q}=${
							abstractRequest.queryFilters![q]
						}`
				)
				.join('');

		const request = new HttpRequest(
			requestType,
			url,
			abstractRequest.body,
			{
				params: abstractRequest.httpParams,
				responseType: abstractRequest.responseType,
			}
		);

		return of(request).pipe(
			this.AttachHeaders(abstractRequest.headers),
			this.AuthorizeRequest()
		);
	}

	private AuthorizeRequest(): any {
		return (
			source: Observable<HttpRequest<any>>
		): Observable<HttpRequest<any>> => {
			return source.pipe(
				first(),
				map((httpRequest) => {
					const token = this.authenticator.token();
					if (!token) {
						throwError(
							() =>
								new Error(
									'User has no valid token to use for the request'
								)
						);
					}
					const updated = httpRequest.clone({
						setHeaders: {
							Authorization: `Bearer ${token}`,
						},
					});
					return updated;
				})
			);
		};
	}

	private AttachHeaders(requestHeaders: HttpHeaders | undefined) {
		return (
			source: Observable<HttpRequest<any>>
		): Observable<HttpRequest<any>> => {
			if (!requestHeaders) return source;

			return source.pipe(
				first(),
				map((httpRequest) => {
					const updated = httpRequest.clone({
						headers: requestHeaders,
					});
					return updated;
				})
			);
		};
	}

	private ExecuteRequest<Response>() {
		return (source: Observable<HttpRequest<any>>): Observable<Response> => {
			return source.pipe(
				//take the last observable from the built request
				switchMap<HttpRequest<any>, Observable<Response>>((request) => {
					return this.httpClient.request(request).pipe(
						last(),
						map((response) => {
							if (response instanceof HttpResponse)
								return response.body;

							if (response instanceof HttpErrorResponse) {
								// console.log(response);
								throwError(() => response);
							}
							return response;
						})
					) as Observable<Response>;
				}),
				// retry(1),
				// //timeout never
				timeout({ first: 999999999 })
			);
		};
	}

	protected GET<Response>(
		request: AbstractHttpRequest
	): Observable<Response> {
		return this.BuildRequest(request, 'GET').pipe(
			this.ExecuteRequest<Response>()
		);
	}

	protected PUT<Response>(
		request: AbstractHttpRequest
	): Observable<Response> {
		return this.BuildRequest(request, 'PUT').pipe(
			this.ExecuteRequest<Response>()
		);
	}

	protected PATCH<Response>(
		request: AbstractHttpRequest
	): Observable<Response> {
		return this.BuildRequest(request, 'PATCH').pipe(
			this.ExecuteRequest<Response>()
		);
	}

	protected POST<Response>(
		request: AbstractHttpRequest
	): Observable<Response> {
		return this.BuildRequest(request, 'POST').pipe(
			this.ExecuteRequest<Response>()
		);
	}

	protected DELETE<Response>(
		request: AbstractHttpRequest
	): Observable<Response> {
		return this.BuildRequest(request, 'DELETE').pipe(
			this.ExecuteRequest<Response>()
		);
	}
}
