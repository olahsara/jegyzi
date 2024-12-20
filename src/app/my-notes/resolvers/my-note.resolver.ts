import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Note } from '../../shared/models/note.model';
import { NoteService } from '../../shared/services/note.service';

/** Az navigáció során megadott id alapján a jegyzet adatait feloldó resolver */
export function myNoteResolver(): ResolveFn<Note> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const service = inject(NoteService);

    const id = route.params['id'] as string;
    return service.getNoteById(id).then((element) => {
      return element;
    });
  };
}
