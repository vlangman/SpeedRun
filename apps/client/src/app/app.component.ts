import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../components/navbar/navbar.component";
import { ToastService } from '../services/toast-service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';

@Component({
	imports: [RouterModule,CommonModule, NavbarComponent,NgIcon],
	selector: 'app-root',
	providers: [provideIcons({

	})],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'client';

	constructor(public toastService: ToastService)
	{
		
	}
}
