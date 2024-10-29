import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/shell/shell.component').then((c) => c.ShellComponent),
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
        loadComponent: () => import('./login/pages/login/login.component').then((c) => c.LoginComponent),
        data: {
          title: 'Bejelentkezés',
          subtitle:
            'Lépj be a jegyzetek világába, hogy számos új funkció megnyíljon előtted az oldalon. Amennyiben még nem vagy tagja a Jegyzi közösségnek regisztrálj, és oszd meg velünk a tudásod egy jegyzet formájában, vagy tanulj gyorsan és egyszerűen!',
        },
      },
      {
        path: 'profiles',
        data: { title: 'Felhasználók' },
        loadChildren: () => import('./profile/routes').then((c) => c.ROUTES),
      },

      {
        path: 'my-profile',
        pathMatch: 'full',
        loadComponent: () => import('./profile/pages/my-profile-page/my-profile-page.component').then((c) => c.MyProfilePageComponent),
      },
      {
        path: 'new-note',
        pathMatch: 'full',
        loadComponent: () => import('./text-editor/pages/text-editor-component/text-editor.component').then((c) => c.TextEditorComponent),
      },
      {
        path: 'notes',
        loadChildren: () => import('./note/routes').then((c) => c.ROUTES),
      },
    ],
  },
];
