import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./shared/layout/header/header.component").then((c) => c.HeaderComponent),
    children: [
      {
        path: '',
        pathMatch: "full",
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadComponent: () => import("./home/pages/home-page/home-page.component").then((c) => c.HomePageComponent),
        data: {title: 'Főoldal'}
      }

    ]
  }
];
