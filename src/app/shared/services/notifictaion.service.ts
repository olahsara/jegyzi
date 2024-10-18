import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  readNotification(notificationId: string) {
    if (notificationId) {
      return this.store.collection<Notification>(this.collection).doc(notificationId).update({ new: false });
    }
    return;
  }
}
