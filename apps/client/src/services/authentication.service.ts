import { computed, Injectable, signal } from '@angular/core';
import { AbstractAuthService } from './abstract-auth.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

export interface AUTHENTICATION_STATE {
	accessToken: string;
	user: {};
}

@Injectable()
export class AuthenticationService extends AbstractAuthService {
	readonly userTokenKey = 'YOU_X_USER_PROFILE';

	public loggedOutEvent: Subject<void> = new Subject();
	public openConversionModal = new Subject<boolean>();

	// signal to store the current client state
	private _profile = signal({
		accessToken: '',
		user: {},
	});

	// selectors
	public readonly loggedInClient = computed(() => this._profile());

	constructor(private router: Router) {
		super();
		this.fetchLoggedInClient();
	}

	override token = computed(() => this._profile()?.accessToken);

	override setProfile(profile: AUTHENTICATION_STATE) {
		// console.log(profile);
		this._profile.update(() => profile);
		localStorage.setItem(this.userTokenKey, JSON.stringify(profile));
	}

	override logout(): void {
		this.clearProfile();
		this.loggedOutEvent.next();
		this.router.navigate(['/']);
	}

	public clearProfile() {
		this._profile.update(() => {
			return {
				accessToken: '',
				user: {},
			};
		});
		localStorage.removeItem(this.userTokenKey);
	}

	// fetch the current client from local storage
	private fetchLoggedInClient() {
		const user = localStorage.getItem(this.userTokenKey);
		if (user) {
			this._profile.set(JSON.parse(user));
		}
	}
}
