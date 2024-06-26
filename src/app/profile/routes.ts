import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/profile-list-page/profile-list-page.component').then(
        (c) => c.ProfileListPageComponent
      ),
  },
  
];
