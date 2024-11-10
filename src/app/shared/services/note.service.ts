import { inject, Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { ModifyRequest } from '../models/modifiy-request.model';
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

  async createNote(note: Note, user: User) {
    if (note) {
      note.id = this.store.createId();
      return await this.store
        .collection<Note>(this.collectionName)
        .doc(note.id)
        .set(note)
        .then(() => {
          user.followers.map((id) => {
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

  async updateNote(note: Note) {
    if (note) {
      return await this.store
        .collection<Note>(this.collectionName)
        .doc(note.id)
        .update(note)
        .then(() => {
          note.followers.map((id) => {
            const noti: Notification = {
              id: '',
              user: id,
              date: Timestamp.fromDate(new Date()),
              new: true,
              title: 'Módosított jegyzet!',
              type: NotificationType.UPDATED_NOTE,
              linkedEntityId: note.id,
              description: 'Az általad követett ' + note.title + ' című jegyzetet a szerzője módosította! ',
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

  async getMyNotes(id: string) {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.where('creatorId', '==', id).get();

    if (data) {
      data.docs.forEach((element) => {
        notes.push(element.data());
      });
    }
    return notes;
  }

  async getFollowedNotes(id: string) {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.where('followers', 'array-contains', id).get();

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

  async getNotesByFilter(filter: NoteFilterModel, followedNotesUserId?: string): Promise<Note[]> {
    let result = this.store.collection<Note>(this.collectionName).ref as Query<Note>;
    if (followedNotesUserId) result = result.where('followers', 'array-contains', followedNotesUserId);
    if (filter.creatorId) result = result.where('creatorId', '==', filter.creatorId);
    if (filter.stars) result = result.where('avarageStar', '>=', filter.stars);
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

  async getNotesByUser(id: string): Promise<Note[]> {
    const data = await this.store
      .collection<Note>(this.collectionName)
      .ref.where('creatorId', '==', id)
      .get()
      .then((data) => {
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

  async deleteComment(note: Note, commentId: string) {
    const newComments = note.comments.filter((comment) => comment !== commentId);

    return await this.store.collection(this.collectionName).doc(note.id).update({
      comments: newComments,
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
    if (note.comments) {
      newComments = [commentId, ...note.comments];
    } else {
      newComments = [commentId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ comments: newComments });
  }

  async addRequest(requestId: string, note: Note) {
    let newRequests: string[] = [];
    if (note.updateRequests) {
      newRequests = [requestId, ...note.updateRequests];
    } else {
      newRequests = [requestId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ updateRequests: newRequests });
  }

  async deleteRequest(request: ModifyRequest) {
    const data = await this.getNoteById(request.noteId);

    if (data) {
      const newRequest = data[0].updateRequests.filter((id) => request.id !== id);
      return await this.store.collection(this.collectionName).doc(request.noteId).update({
        updateRequests: newRequest,
      });
    }
  }

  async deleteNote(note: Note) {
    await this.store.collection<Note>(this.collectionName).doc(note.id).delete();
  }

  async reduceUpdateRequestsNumber(noteId: string) {
    const note = await this.getNoteById(noteId);
    if (note[0]) {
      return await this.store
        .collection(this.collectionName)
        .doc(note[0].id)
        .update({ numberOfUpdateRequests: note[0].numberOfUpdateRequests - 1 });
    }
  }

  async plusUpdateRequestsNumber(noteId: string) {
    const note = await this.getNoteById(noteId);
    if (note[0]) {
      return await this.store
        .collection(this.collectionName)
        .doc(note[0].id)
        .update({ numberOfUpdateRequests: note[0].numberOfUpdateRequests + 1 });
    }
  }

  async updateCreatorData(userId: string, updateValue: boolean) {
    const notes = await this.getNotesByUser(userId);
    notes.forEach((note) => {
      this.store.collection(this.collectionName).doc(note.id).update({
        creatorProfilPic: updateValue,
      });
    });
  }
}
