export interface APIResponse<T> {
	result: T ;
	errors: APIError[];
}

export interface APIError {
	error?: any;
	status: any;
	message: string;
}
