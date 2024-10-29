import { inject, Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { Note, NoteFilterModel } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { User } from '../models/user.model';
import { getName } from '../utils/name';
import { NotificationService } from './notifictaion.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  readonly collectionName = 'Notes';
  private notificationService = inject(NotificationService);
  private store = inject(AngularFirestore);
  private toastService = inject(ToastService);
  private storage = inject(AngularFireStorage);

  async createNote(note: Note, userFollowers: string[]) {
    if (note) {
      note.id = this.store.createId();
      return await this.store
        .collection<Note>(this.collectionName)
        .doc(note.id)
        .set(note)
        .then(() => {
          userFollowers.map((id) => {
            const noti: Notification = {
              id: '',
              user: id,
              date: Timestamp.fromDate(new Date()),
              new: true,
              title: 'Új jegyzet!',
              type: NotificationType.NEW_NOTE,
              linkedEntityId: note.id,
              description:
                'Egy általad követett felhasználó új jegyzetet hozott létre ' +
                note.title +
                ' címmel és ' +
                note.labels.join(', ') +
                ' címkékkel',
            };
            this.notificationService.createNotification(noti);
          });
          return note.id;
        });
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

  async addNewFollower(user: User, note: Note) {
    let newFollowers: string[] = [];
    if (note.followers) {
      note.followers.push(user.id);
      newFollowers = note.followers;
    } else {
      newFollowers = [user.id];
    }

    return await this.store
      .collection(this.collectionName)
      .doc(note.id)
      .update({
        followers: newFollowers,
        followersNumber: note.followersNumber + 1,
      })
      .then(() => {
        const noti: Notification = {
          date: Timestamp.fromDate(new Date()),
          id: 'id',
          new: true,
          title: 'Új követés!',
          description: getName(user) + ' bekövette a ' + note.title + ' jegyzetedet!',
          type: NotificationType.NEW_FOLLOWER,
          user: user.id,
          linkedEntityId: user.id,
        };
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeres követés!');
      });
  }

  async deleteFollower(user: User, note: Note) {
    const newFollowers = note.followers.filter((userId) => userId !== user.id);

    return await this.store
      .collection(this.collectionName)
      .doc(note.id)
      .update({
        followers: newFollowers,
        followersNumber: note.followersNumber - 1,
      });
  }

  async addReview(reviewId: string, note: Note) {
    let newReviews: string[] = [];
    if (note.reviews) {
      newReviews = [reviewId, ...note.reviews];
    } else {
      newReviews = [reviewId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ reviews: newReviews });
  }

  async addComment(commentId: string, note: Note) {
    let newComments: string[] = [];
    if (note.reviews) {
      newComments = [commentId, ...note.comments];
    } else {
      newComments = [commentId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ comments: newComments });
  }
}
