import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
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
export class ReviewService {
  readonly collectionName = 'Reviews';

  private store = inject(AngularFirestore);
  private storage = inject(AngularFireStorage);
  private notificationService = inject(NotificationService);
  private toastService = inject(ToastService);
  private noteService = inject(NoteService);

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
        this.notificationService.createNotification(noti);
        this.noteService.addReview(review.id, note);
      });
    return data;
  }

  async getReviews() {
    let reviews: Review[] = [];
    const data = await this.store.collection<Review>(this.collectionName).ref.get();

    if (data) {
      data.docs.forEach((element) => {
        reviews.push(element.data());
      });
    }
    return reviews;
  }

  async getReviewById(id: string): Promise<Review[]> {
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

    return data;
  }
}
