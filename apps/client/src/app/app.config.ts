import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ApiService, APP_CONFIG } from '../services/api.service';
import { AuthenticationService } from '../services/authentication.service';
import { LoaderService } from '../services/loader.service';
import { ToastService } from '../services/toast.service';


export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(appRoutes),
		provideHttpClient(),
		{
			provide: APP_CONFIG,
			useValue: environment
		},

		ApiService,
		AuthenticationService,
		LoaderService,
		ToastService

	],
};
