import { Route } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    data: { title: 'Felhasználók' },
    loadComponent: () => import('./pages/profile-list-page/profile-list-page.component').then((c) => c.ProfileListPageComponent),
  },
  {
    path: ':id',
    resolve: { profile: profileResolver() },
    loadComponent: () => import('./pages/profile-details-page/profile-details-page.component').then((c) => c.ProfileDetailsPageComponent),
  },
];
