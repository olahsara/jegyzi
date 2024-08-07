import { Routes } from '@angular/router';
import { profileResolver } from './profile/resolvers/profile.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/header/header.component').then(
        (c) => c.HeaderComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/pages/home-page/home-page.component').then(
            (c) => c.HomePageComponent
          ),
        data: { title: 'Üdvözöllek a jegyzetek világában!' },
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/pages/login/login.component').then(
            (c) => c.LoginComponent
          ),
        data: {
          title: 'Bejelentkezés',
          subtitle:
            'Lépj be a jegyzetek világába, hogy számos új funkció megnyíljon előtted az oldalon. Amennyiben még nem vagy tagja a Jegyzi közösségnek regisztrálj, és oszd meg velünk a tudásod egy jegyzet formájában, vagy tanulj gyorsan és egyszerűen!',
        },
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/pages/register-page/register-page.component').then(
            (c) => c.RegisterPageComponent
          ),
        data: {
          title: 'Regisztráció',
          subtitle:
            'Légy te is a közösségünk tagja, tanulj velünk vagy segíts a társaidnak egy-egy jegyzet formájában! A regisztráció első lépéseként add meg a kötelező adatok. Regisztráció után a profilodat személyre tudod szabni, valamint korlátozások nélkül tudod használni az oldalt.',
        },
      },
      {
        path: 'profiles',
        data: {title: 'Felhasználók'},
        loadChildren: () =>
          import('./profile/routes').then(
            (c) => c.ROUTES
          ),
      },
      
      {
        path: 'my-profile',
        pathMatch: 'full',
        loadComponent: () =>
          import('./profile/pages/my-profile-page/my-profile-page.component').then(
            (c) => c.MyProfilePageComponent
          ),
      },
    ],
  },
];
