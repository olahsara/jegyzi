import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  readonly collectionName = 'Notes';

  constructor(private store: AngularFirestore, private storage: AngularFireStorage) {}

  createNote(note: Note) {
    if (note) {
      note.id = this.store.createId();
      return this.store.collection<Note>(this.collectionName).doc(note.id).set(note);
    }
    return;
  }

  async getNotes() {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.get();

    if (data) {
      data.docs.forEach((element) => {
        notes.push(element.data());
      });
    }
    return notes;
  }

  async getNoteById(id: string): Promise<Note[]> {
    const data = await this.store
      .collection<Note>(this.collectionName)
      .ref.where('id', '==', id)
      .limit(1)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }
}
