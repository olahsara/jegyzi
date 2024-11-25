import { Routes } from '@angular/router';
import { authGuard } from './shared/auth/auth.guard';

/** Navigáció */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/header/header.component').then((c) => c.HeaderComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then((c) => c.HomePageComponent),
        data: { title: 'Üdvözöllek a jegyzetek világában!' },
      },
      {
        path: 'login',
        loadComponent: () => import('./login/pages/login-page/login-page.component').then((c) => c.LoginPageComponent),
        data: {
          title: 'Bejelentkezés',
          subtitle:
            'Lépj be a jegyzetek világába, hogy számos új funkció megnyíljon előtted az oldalon. Amennyiben még nem vagy tagja a Jegyzi közösségnek regisztrálj, és oszd meg velünk a tudásod egy jegyzet formájában, vagy tanulj gyorsan és egyszerűen!',
        },
      },
      {
        path: 'auth',
        data: {
          title: 'Új jelszó megadása',
          subtitle: 'Kérlek add meg a belépéshez szükséges új jelszavadat. A jelszónak minimum 6 karakter hosszúnak kell lennie!',
        },
        loadComponent: () =>
          import('./login/pages/authentication-managment-page/authentication-managment-page.component').then(
            (c) => c.AuthenticationManagmentPageComponent,
          ),
      },
      {
        path: 'profiles',
        loadChildren: () => import('./profile/routes').then((c) => c.ROUTES),
      },
      {
        path: 'notes',
        loadChildren: () => import('./note/routes').then((c) => c.ROUTES),
      },

      {
        path: 'my-notes',
        loadChildren: () => import('./my-notes/routes').then((c) => c.ROUTES),
      },
      {
        path: 'my-profile',
        canActivate: [authGuard()],
        pathMatch: 'full',
        loadComponent: () => import('./profile/pages/my-profile-page/my-profile-page.component').then((c) => c.MyProfilePageComponent),
      },
    ],
  },
];
