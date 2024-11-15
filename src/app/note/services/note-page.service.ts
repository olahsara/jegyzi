import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../../shared/models/note.model';
import { NoteService } from '../../shared/services/note.service';

@Injectable()
/** A jegyzet részletes oldalát kezelő szolgáltatás  */
export class NotePageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private noteService = inject(NoteService);

  /** A jegyzet (resolverből kapott) */
  readonly note = signal<Note>(this.activatedRoute.snapshot.data['note']);
  readonly id = signal<string>(this.activatedRoute.snapshot.params['id'] as string);

  /**
   * A jegyzet adatainak újratöltése
   * @param updated a frissült adattal rendelkező jegyzet
   */
  reload(updated?: Note) {
    if (updated) {
      this.note.set(updated);
    } else {
      this.getNote().then((value) => {
        this.note.set(value);
      });
    }
  }

  /** Jegyzet lekérése */
  async getNote() {
    const data = await this.noteService.getNoteById(this.id());
    return data;
  }
}
