import { inject, Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
/** Az értesítéseket kezelő szolgáltatás */
export class NotificationService {
  private store = inject(AngularFirestore);
  readonly collection = 'Notifications';

  /**
   * Értesítés létrehozása
   * @param notification értesítés
   */
  createNotification(notification: Notification) {
    notification.id = this.store.createId();
    if (notification) {
      return this.store.collection<Notification>(this.collection).doc(notification.id).set(notification);
    }
    return;
  }

  /**
   * Olvasatlan értesítések lekérése dátum szerint csökkenő sorrendben
   * @param userId felhasználó id-ja
   * @returns értesítések
   */
  async getLatestNotifications(userId: string) {
    let result = this.store.collection<Notification>(this.collection).ref as Query<Notification>;
    result = result.where('user', '==', userId);
    result = result.where('new', '==', true);

    const data = await result
      .orderBy('date', 'desc')
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Összes értesítés lekérése
   * @param userId felhasználó id-ja
   * @returns értesítések lista
   */
  async getNotifications(userId: string) {
    let result = this.store.collection<Notification>(this.collection).ref as Query<Notification>;
    result = result.where('user', '==', userId);

    const data = await result
      .orderBy('date', 'desc')
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Értesítés státuszának beállítása
   * @param notificationId értesítés id-ja
   * @param status olvasott / olvasatlan
   */
  setNotificationStatus(notificationId: string, status: boolean) {
    if (notificationId) {
      return this.store.collection<Notification>(this.collection).doc(notificationId).update({ new: status });
    }
    return;
  }

  /**
   * Értesítés törlése
   * @param notificationId értesítés id-ja
   */
  deleteNotification(notificationId: string) {
    if (notificationId) {
      return this.store.collection<Notification>(this.collection).doc(notificationId).delete();
    }
    return;
  }

  /**
   * Értesítés lekérése id alapján
   * @param id értesítés id-ja
   * @returns értesítés
   */
  async getNotificationById(id: string): Promise<Notification> {
    const data = await this.store
      .collection<Notification>(this.collection)
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
}
