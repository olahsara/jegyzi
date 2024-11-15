import { inject, Injectable, signal } from '@angular/core';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { Note, NoteFilterModel } from '../../shared/models/note.model';
import { NoteService } from '../../shared/services/note.service';
import { UserService } from '../../shared/services/user.service';

@Injectable()
/** A sáját jegyzetek oldalt kezelő szolgáltatás  */
export class MyNotesPageService {
  private userService = inject(UserService);
  private noteService = inject(NoteService);

  /** Bejelentkezett felhasználó */
  private user = this.userService.user;

  /** Jegyzet lista */
  notes$ = signal<Promise<Note[]> | undefined>(undefined);

  /** Jegyzet lista inicializálása */
  constructor() {
    explicitEffect([this.user], ([user]) => {
      if (user) {
        this.notes$.set(this.noteService.getMyNotes(user.id));
      }
    });
  }

  /** Szűrés
   * @param filter megadott feltételek
   */
  filter(filter: NoteFilterModel) {
    filter.creatorId = this.user()!.id;
    this.notes$.set(this.noteService.getNotesByFilter(filter));
  }

  /** Lista frissítése */
  reload() {
    if (this.user()) {
      this.notes$.set(this.noteService.getMyNotes(this.user()!.id));
    }
  }
}
