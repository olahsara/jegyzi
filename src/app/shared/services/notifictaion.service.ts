import { inject, Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private store = inject(AngularFirestore);
  readonly collection = 'Notifications';

  createNotification(notification: Notification) {
    if (notification) {
      return this.store
        .collection<Notification>(this.collection)
        .add(notification)
        .then((v) => {
          v.update({ id: v.id });
        });
    }
    return;
  }

  async getNotifications(userId: string) {
    let result = this.store.collection<Notification>(this.collection).ref as Query<Notification>;
    result = result.where('user', '==', userId);
    result = result.where('new', '==', true);

    const data = await result.get().then((data) => {
      return data.docs.map((e) => {
        return e.data();
      });
    });

    return data;
  }

  readNotification(notificationId: string) {
    if (notificationId) {
      return this.store.collection<Notification>(this.collection).doc(notificationId).update({ new: false });
    }
    return;
  }
}
