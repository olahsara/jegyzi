import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Note } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { Review } from '../models/review.model';
import { NoteService } from './note.service';
import { NotificationService } from './notifictaion.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
/** Az értékeléseket kezelő szolgáltatás */
export class ReviewService {
  readonly collectionName = 'Reviews';

  private store = inject(AngularFirestore);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private noteService = inject(NoteService);

  /**
   * Értékelés készítése
   * @param review Értékelés
   * @param note Jegyzet, amihez az értékelés készült
   */
  async createReview(review: Review, note: Note) {
    review.id = this.store.createId();

    const data = await this.store
      .collection<Review>(this.collectionName)
      .doc(review.id)
      .set(review)
      .then(() => {
        this.toastService.success('Értékelés elküldve!');
        const noti: Notification = {
          id: '',
          user: note.creatorId,
          date: Timestamp.fromDate(new Date()),
          new: true,
          title: 'Új értékelés!',
          type: NotificationType.REVIEW,
          linkedEntityId: note.id,
          description: review.anonim
            ? 'Új értékelés érkezett a(z) ' + note.title + ' című jegyzetedhez.'
            : review.userName + ' értékelte a(z) ' + note.title + ' című jegyzetedet.',
        };
        this.updateAvarageReview(note.id);
        this.notificationService.createNotification(noti);
        this.noteService.addReview(review.id, note);
      });
    return data;
  }

  /**
   * Átlagos értékelés frissítése
   * @param noteId a jegyzet id-ja, aminél frissíteni kell
   */
  async updateAvarageReview(noteId: string) {
    const data = await this.getReviewsbyNote(noteId).then((value) => {
      let sum = 0;
      value.map((review) => {
        sum += review.stars;
      });
      this.store
        .collection<Note>('Notes')
        .doc(noteId)
        .update({ avarageStar: Math.floor(sum / value.length) });
    });
    return data;
  }

  /**
   * Értékelések lekérése
   * @returns Értékelések lista
   */
  async getReviews() {
    const data = await this.store
      .collection<Review>(this.collectionName)
      .ref.get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Jegyzethez érkezett értékelések lekérése
   * @param noteId jegyzet id-ja
   * @returns Értékelések lista
   */
  async getReviewsbyNote(noteId: string) {
    const data = await this.store
      .collection<Review>(this.collectionName)
      .ref.where('notesId', '==', noteId)
      .orderBy('submitDate', 'desc')
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Jegyzethez érkezett értékelések lekérése (3db)
   * @param noteId jegyzet id-ja
   * @returns Értékelések lista
   */
  async getReviewsbyNoteLimited(noteId: string) {
    const data = await this.store
      .collection<Review>(this.collectionName)
      .ref.where('notesId', '==', noteId)
      .orderBy('submitDate', 'desc')
      .limit(3)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });
    return data;
  }

  /**
   * Felhasználó által írt  értékelések lekérése
   * @param userId felhasználó id-ja
   * @returns Értékelések lista
   */
  async getReviewsbyUser(userId: string) {
    const data = await this.store
      .collection<Review>(this.collectionName)
      .ref.where('userId', '==', userId)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Értékelés lekérése id alapján
   * @param id értékelés id-ja
   * @returns az értékelés
   */
  async getReviewById(id: string): Promise<Review> {
    const data = await this.store
      .collection<Review>(this.collectionName)
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
   * Értékelés trölése
   * @param id értékelés id-ja
   * @param note a jegyzet, amihez az értékelés érkezett
   */
  async deleteReview(id: string, note?: Note) {
    const data = await this.store
      .collection<Review>(this.collectionName)
      .doc(id)
      .delete()
      .then(() => {
        if (note) {
          this.noteService.deleteReview(note, id);
        }
      });

    return data;
  }

  /**
   * Értékelés szerzőjének módosítása felhasználó törlése esetén
   * @param userId törölt felhasználó id-ja
   */
  async updateReviewCreator(userId: string) {
    const reviews = await this.getReviewsbyUser(userId);

    if (reviews) {
      reviews
        .filter((review) => review.anonim !== true)
        .map((review) =>
          this.store.collection<Review>(this.collectionName).doc(review.id).update({ userId: '0', userName: '', anonim: true }),
        );
    }
  }
}
