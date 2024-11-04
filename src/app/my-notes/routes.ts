import { Route } from '@angular/router';
import { authGuard } from '../shared/auth/auth.guard';

export const ROUTES: Route[] = [
  //shell
  {
    path: '',
    canActivate: [authGuard()],
    loadComponent: () => import('./pages/my-notes-shell-page/my-notes-shell-page.component').then((c) => c.MyNotesShellPagesComponent),
  },
  {
    path: 'new-note',
    canActivate: [authGuard()],
    loadComponent: () => import('./pages/text-editor-component/text-editor.component').then((c) => c.TextEditorComponent),
  },
];
