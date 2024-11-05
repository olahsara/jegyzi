import { inject, Injectable, signal } from '@angular/core';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { Note, NoteFilterModel } from '../../shared/models/note.model';
import { NoteService } from '../../shared/services/note.service';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class FollowedNotesPageService {
  private userService = inject(UserService);
  private noteService = inject(NoteService);

  private user = this.userService.user;

  notes$ = signal<Promise<Note[]> | undefined>(undefined);

  constructor() {
    explicitEffect([this.user], ([user]) => {
      if (user) {
        this.notes$.set(this.noteService.getFollowedNotes(user.id));
      }
    });
  }

  filter(filter: NoteFilterModel) {
    this.notes$.set(this.noteService.getNotesByFilter(filter, this.user()!.id));
  }
  reload() {
    if (this.user()) {
      this.notes$.set(this.noteService.getFollowedNotes(this.user()!.id));
    }
  }
}
