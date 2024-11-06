import { Route } from '@angular/router';
import { noteResolver } from './resolvers/resolvers/note.resolver';
export const ROUTES: Route[] = [
  {
    path: '',
    data: { title: 'Jegyzetek', info: 'A jegyzet kártyájára kattintva meg tudod tekinteni a jegyzet részleteit.' },
    loadComponent: () => import('./pages/note-list-page/note-list-page.component').then((c) => c.NoteListPageComponent),
  },
  {
    path: ':id',
    resolve: { note: noteResolver() },
    loadComponent: () => import('./pages/note-details-page/note-details-page.component').then((c) => c.NoteDetailsPageComponent),
  },
];
