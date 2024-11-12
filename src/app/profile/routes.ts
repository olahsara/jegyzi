import { Route } from '@angular/router';
import { authGuard } from '../shared/auth/auth.guard';
import { profileResolver } from './resolvers/profile.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    data: { title: 'Felhasználók', info: 'A felhasználó kártyájára kattintva meg tudod nézni a felhasználó részleteit.' },
    loadComponent: () => import('./pages/profile-list-page/profile-list-page.component').then((c) => c.ProfileListPageComponent),
  },
  {
    path: ':id',
    resolve: { profile: profileResolver() },
    loadComponent: () => import('./pages/profile-details-page/profile-details-page.component').then((c) => c.ProfileDetailsPageComponent),
  },
  {
    path: 'my-profile',
    canActivate: [authGuard()],
    pathMatch: 'full',
    loadComponent: () => import('./pages/my-profile-page/my-profile-page.component').then((c) => c.MyProfilePageComponent),
  },
];
