import { inject, Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { ModifyRequest } from '../models/modifiy-request.model';
import { Note, NoteFilterModel } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { User } from '../models/user.model';
import { NotificationService } from './notifictaion.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
/** Jegyzeteket kezelő szolgáltatás */
export class NoteService {
  readonly collectionName = 'Notes';
  private notificationService = inject(NotificationService);
  private store = inject(AngularFirestore);
  private toastService = inject(ToastService);

  /**
   * Jegyzet készítése
   * @param note jegyzet
   * @param user felhasználó
   */
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

  /**
   * Jegyzet frissítése
   * @param note jegyzet
   */
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

  /**
   * Jegyzetek lekérése
   * @return jegyzetek lista
   */
  async getNotes(): Promise<Note[]> {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.get();

    if (data) {
      data.docs.forEach((element) => {
        notes.push(element.data());
      });
    }
    return notes;
  }

  /**
   * Bejelentkezett felhasználó jegyzeteinek lekérése
   * @param id felhasználó id-ja
   * @return jegyzetek lista
   */
  async getMyNotes(id: string): Promise<Note[]> {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.where('creatorId', '==', id).get();

    if (data) {
      data.docs.forEach((element) => {
        notes.push(element.data());
      });
    }
    return notes;
  }

  /**
   * Bejelentkezett felhasználó követett jegyzeteinek lekérése
   * @param id felhasználó id-ja
   * @return jegyzetek lista
   */
  async getFollowedNotes(id: string): Promise<Note[]> {
    let notes: Note[] = [];
    const data = await this.store.collection<Note>(this.collectionName).ref.where('followers', 'array-contains', id).get();

    if (data) {
      data.docs.forEach((element) => {
        notes.push(element.data());
      });
    }
    return notes;
  }

  /**
   *Jegyzet lekérése id alapján
   * @param id jegyzet id-ja
   * @return jegyzet
   */
  async getNoteById(id: string): Promise<Note> {
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

    return data[0];
  }

  /**
   *Legtöbb követővel rendelkező jegyzetek lekérése
   * @return jegyzetek lista
   */
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

  /**
   *Szűrt jegyzetek lekérése
   * @param filter szűrő
   * @param followedNotesUserId a felhasználó követett jegyzeteinek lekérésére
   * @return jegyzetek lista
   */
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

  /**
   *Felhasználók jegyzeteinek lekérése
   * @param id felhasználó id-ja
   * @return jegyzetek lista
   */
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

  /**
   * Felhasználó hozzáadása a jegyzet követőihez
   * @param user felhasználó
   * @param note jegyzet
   */
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
          description: user.name + ' bekövette a ' + note.title + ' jegyzetedet!',
          type: NotificationType.NEW_FOLLOWER,
          user: note.creatorId,
          linkedEntityId: user.id,
        };
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeres követés!');
      });
  }

  /**
   * Felhasználó törlése a jegyzet követőiből
   * @param user felhasználó
   * @param note jegyzet
   */
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

  /**
   *Komment törlése
   * @param note jegyzet
   *  @param commentId komment id-ja
   */
  async deleteComment(note: Note, commentId: string) {
    const newComments = note.comments.filter((comment) => comment !== commentId);

    return await this.store.collection(this.collectionName).doc(note.id).update({
      comments: newComments,
    });
  }

  /**
   * Értékelés hozzáadása
   * @param reviewId értékelés id-ja
   * @param note jegyzet
   */
  async addReview(reviewId: string, note: Note) {
    let newReviews: string[] = [];
    if (note.reviews) {
      newReviews = [reviewId, ...note.reviews];
    } else {
      newReviews = [reviewId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ reviews: newReviews });
  }

  /**
   * Komment hozzáadása
   * @param commentId komment id-ja
   * @param note jegyzet
   */
  async addComment(commentId: string, note: Note) {
    let newComments: string[] = [];
    if (note.comments) {
      newComments = [commentId, ...note.comments];
    } else {
      newComments = [commentId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ comments: newComments });
  }

  /**
   * Módosítási kérés hozzáadása
   * @param requestId módosítási kérés id-ja
   * @param note jegyzet
   */
  async addRequest(requestId: string, note: Note) {
    let newRequests: string[] = [];
    if (note.updateRequests) {
      newRequests = [requestId, ...note.updateRequests];
    } else {
      newRequests = [requestId];
    }

    return await this.store.collection(this.collectionName).doc(note.id).update({ updateRequests: newRequests });
  }

  /**
   * Módosítási kérés törlése
   * @param request módosítási kérés
   */
  async deleteRequest(request: ModifyRequest) {
    const data = await this.getNoteById(request.noteId);

    if (data) {
      const newRequest = data.updateRequests.filter((id) => request.id !== id);
      return await this.store.collection(this.collectionName).doc(request.noteId).update({
        updateRequests: newRequest,
      });
    }
  }

  /**
   * Értékelés törlése
   * @param note jegyzet
   * @param reviewId értékelés id-ja
   */
  async deleteReview(note: Note, reviewId: string) {
    const newReviews = note.reviews.filter((review) => review !== reviewId);

    return await this.store.collection(this.collectionName).doc(note.id).update({
      reviews: newReviews,
    });
  }

  /**
   * Jegyzet törlése
   * @param note jegyzet
   */
  async deleteNote(note: Note) {
    await this.store.collection<Note>(this.collectionName).doc(note.id).delete();
  }

  /**
   * Módosítási kérések számának csökkentése
   * @param noteId jegyzet id-ja
   */
  async reduceUpdateRequestsNumber(noteId: string) {
    const note = await this.getNoteById(noteId);
    if (note) {
      return await this.store
        .collection(this.collectionName)
        .doc(note.id)
        .update({ numberOfUpdateRequests: note.numberOfUpdateRequests - 1 });
    }
  }

  /**
   * Módosítási kérések számának növelése
   * @param noteId jegyzet id-ja
   */
  async plusUpdateRequestsNumber(noteId: string) {
    const note = await this.getNoteById(noteId);
    if (note) {
      return await this.store
        .collection(this.collectionName)
        .doc(note.id)
        .update({ numberOfUpdateRequests: note.numberOfUpdateRequests + 1 });
    }
  }
}
