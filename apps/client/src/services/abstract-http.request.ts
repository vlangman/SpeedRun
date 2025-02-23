import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface AbstractHttpRequest {
	endpoint: string;
	baseRef?: string;
	headers?: HttpHeaders;
	httpParams?: HttpParams;
	responseType?: 'arraybuffer' | 'blob' | 'json' | 'text' | undefined;
	body?: any;
	queryFilters?: any;
}
