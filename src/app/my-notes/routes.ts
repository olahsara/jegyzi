import { Route } from '@angular/router';
import { authGuard } from '../shared/auth/auth.guard';
import { myNoteResolver } from './resolvers/my-note.resolver';

export const ROUTES: Route[] = [
  {
    /** Jegyzeteim oldal váza */
    path: '',
    canActivate: [authGuard()],
    loadComponent: () => import('./pages/my-notes-shell-page/my-notes-shell-page.component').then((c) => c.MyNotesShellPagesComponent),
    children: [
      /** Jegyzeteim listoldal */
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/my-notes-list-page/my-notes-list-page.component').then((c) => c.MyNotesListPageComponent),
      },
      /** Módosítási kérések listaoldal */
      {
        path: 'modify-request',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/modify-request-list-page/modify-request-list-page.component').then((c) => c.ModifyRequestListPagesComponent),
      },
      /** Követett jegyzetek listaoldal */
      {
        path: 'followed-notes',
        loadComponent: () =>
          import('./pages/followed-notes-list-page/followed-notes-list-page.component').then((c) => c.FollowedNotesListPageComponent),
      },
      /** Új jegyzet lértehozása oldal */
      {
        path: 'new-note',
        loadComponent: () => import('./pages/text-editor-page-component/text-editor-page.component').then((c) => c.TextEditorPageComponent),
      },
    ],
  },
  /** Jegyzetem részletes oldal */
  {
    path: ':id',
    canActivate: [authGuard()],
    pathMatch: 'full',
    resolve: { myNote: myNoteResolver() },
    loadComponent: () => import('./pages/my-note-details-page/my-note-details-page.component').then((c) => c.MyNoteDetailsPageComponent),
  },
  /** Jegyzet szerkesztése oldal */
  {
    path: 'edit-note/:id',
    canActivate: [authGuard()],
    pathMatch: 'full',
    resolve: { myNote: myNoteResolver() },
    loadComponent: () => import('./pages/text-editor-page-component/text-editor-page.component').then((c) => c.TextEditorPageComponent),
  },
];
