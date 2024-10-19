import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Note, NoteFilterModel } from '../models/note.model';

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

  async getTopNotes(): Promise<Note[]> {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.orderBy('followersNumber', 'desc').limit(3).get();

    if (data) {
      data.docs.forEach((element) => {
        notes.push(element.data());
      });
    }
    return notes;
  }

  async getNotesByFilter(filter: NoteFilterModel): Promise<Note[]> {
    let result = this.store.collection<Note>(this.collectionName).ref as Query<Note>;
    if (filter.creatorId) result = result.where('creatorId', '==', filter.creatorId);
    if (filter.title) result = result.where('title', '==', filter.title);
    if (filter.followersNumber) result = result.where('followersNumber', '==', filter.followersNumber);
    if (filter.labels.length) result = result.where('labels', 'array-contains-any', filter.labels);
    if (filter.createdDate.createdDateMin) result = result.where('created', '>=', filter.createdDate.createdDateMin);
    if (filter.createdDate.createdDateMax) result = result.where('created', '<=', filter.createdDate.createdDateMax);

    if (filter.lastModifiedDate.lastModifiedMin) result = result.where('lastModify', '>=', filter.lastModifiedDate.lastModifiedMin);
    if (filter.lastModifiedDate.lastModifiedMax) result = result.where('lastModify', '<=', filter.lastModifiedDate.lastModifiedMax);

    const data = await result.get().then((data) => {
      return data.docs.map((e) => {
        return e.data();
      });
    });

    return data;
  }
}
