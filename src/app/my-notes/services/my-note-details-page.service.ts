import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../../shared/models/note.model';
import { NoteService } from '../../shared/services/note.service';

@Injectable()
export class MyNoteDetailsPageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private noteService = inject(NoteService);

  readonly note = signal<Note>(this.activatedRoute.snapshot.data['myNote']);
  readonly id = signal<string>(this.activatedRoute.snapshot.params['id'] as string);

  reload(updated?: Note) {
    if (updated) {
      this.note.set(updated);
    } else {
      this.getNote().then((value) => {
        this.note.set(value);
      });
    }
  }

  async getNote() {
    const data = await this.noteService.getNoteById(this.id());
    return data[0];
  }
}
