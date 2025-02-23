import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('../components/test-builder/test-builder.component').then(m => m.TestBuilderComponent),

    },

        
];
