import { Signal } from '@angular/core';

export abstract class AbstractAuthService {
	[x: string]: any;

	abstract setProfile(profile: any): void;

	abstract token: Signal<string | null>;

	abstract logout(): void;
}
