import { Route } from '@angular/router';
import { myProfileResolver } from './resolvers/my-profile.resolve';

export const ROUTES: Route[] = [
  {
    path: 'my-profile',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/my-profile-page/my-profile-page.component').then(
        (c) => c.MyProfilePageComponent
      ),
    resolve: { profile: myProfileResolver() },
  },
];
