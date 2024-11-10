import { Route } from '@angular/router';
import { authGuard } from '../shared/auth/auth.guard';
import { myNoteResolver } from './resolvers/my-note.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    canActivate: [authGuard()],
    loadComponent: () => import('./pages/my-notes-shell-page/my-notes-shell-page.component').then((c) => c.MyNotesShellPagesComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/my-notes-list-page/my-notes-list-page.component').then((c) => c.MyNotesListPageComponent),
      },
      {
        path: 'modify-request',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/modify-request-list-page/modify-request-list-page.component').then((c) => c.ModifyRequestListPagesComponent),
      },
      {
        path: 'followed-notes',
        loadComponent: () =>
          import('./pages/followed-notes-list-page/followed-notes-list-page.component').then((c) => c.FollowedNotesListPageComponent),
      },
      {
        path: 'new-note',
        loadComponent: () => import('./pages/text-editor-component/text-editor.component').then((c) => c.TextEditorComponent),
      },
    ],
  },
  {
    path: ':id',
    pathMatch: 'full',
    resolve: { myNote: myNoteResolver() },
    loadComponent: () => import('./pages/my-note-details-page/my-note-details-page.component').then((c) => c.MyNoteDetailsPageComponent),
  },
  {
    path: 'edit-note/:id',
    pathMatch: 'full',
    resolve: { myNote: myNoteResolver() },
    loadComponent: () => import('./pages/text-editor-component/text-editor.component').then((c) => c.TextEditorComponent),
  },
];
