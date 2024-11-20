import { Route } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';

export const ROUTES: Route[] = [
  /** Felhasználók lista oldal */
  {
    path: '',
    data: { title: 'Felhasználók', info: 'A felhasználó kártyájára kattintva meg tudod nézni a felhasználó részleteit.' },
    loadComponent: () => import('./pages/profile-list-page/profile-list-page.component').then((c) => c.ProfileListPageComponent),
  },

  /** Felhasználó részletes oldal */
  {
    path: ':id',
    resolve: { profile: profileResolver() },
    loadComponent: () => import('./pages/profile-details-page/profile-details-page.component').then((c) => c.ProfileDetailsPageComponent),
  },
];
