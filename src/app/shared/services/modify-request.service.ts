import { inject, Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { ModifyRequest, ModifyRequestStatus } from '../models/modifiy-request.model';
import { Note } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { NoteService } from './note.service';
import { NotificationService } from './notifictaion.service';
import { ToastService } from './toast.service';

/**Módosítási kérérseket kezelő service*/
@Injectable({ providedIn: 'root' })
export class ModifyRequestService {
  readonly collectionName = 'ModifyRequests';

  private store = inject(AngularFirestore);
  private notificationService = inject(NotificationService);
  private noteService = inject(NoteService);
  private toastService = inject(ToastService);

  /**Módosítási kérés létrehozása:
   * @param request a módosítási kérés
   * @param note a jegyzet, amelyhez a módosítási kérés készítve lett
   */
  async createModifyRequest(request: ModifyRequest, note: Note) {
    request.id = this.store.createId();
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
      .doc(request.id)
      .set(request)
      .then(async () => {
        const noti: Notification = {
          id: '',
          user: request.noteCreator,
          date: Timestamp.fromDate(new Date()),
          new: true,
          title: 'Új módosítási kérés!',
          type: NotificationType.MODIFY_REQUEST,
          linkedEntityId: request.id,
          description:
            request.creatorName +
            ' módosítási kérést küldött a ' +
            request.noteTitle +
            ' című jegyzetedhez. Nézd meg és kezeld a módosítási kérést minél előbb!',
        };
        this.notificationService.createNotification(noti);
        await this.noteService.plusUpdateRequestsNumber(request.noteId);
        this.noteService.addRequest(request.id, note);
        this.toastService.success('Sikeresen elküldted a módosítási kérést!');
      });
    return data;
  }

  /** Felhasználó által beküldött módosítási kérések lekérése:
   * @param creatorId a felhasználó azonosítója
   */
  async getAllModfiyRequestsByCreator(creatorId: string) {
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
      .ref.where('creatorId', '==', creatorId)
      .orderBy('date', 'desc')
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /** Felhasználónak érkezett módosítási kérések lekérése státusz alapján:
   * @param userId a felhasználó azonosítója
   * @param status a módosítási kérés(ek) státusza
   */
  async getAllModfiyRequestsByNoteCreatorAndStatus(userId: string, status: ModifyRequestStatus) {
    let result = this.store.collection<ModifyRequest>(this.collectionName).ref as Query<ModifyRequest>;
    result = result.where('noteCreator', '==', userId);
    result = result.where('status', '==', status);

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

  /**Módosítási kérés adatainak lekérése az azonosítója (id) alapán:
   * @param id a lekérni kívánt módosítási kérés azonosítója
   */
  async getModifyRequestById(id: string) {
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
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

  /**Módosítási kérés elfogadása:
   * @param request az elfogani kívánt módosítási kérés.
   */
  async acceptModifyRequest(request: ModifyRequest) {
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
      .doc(request.id)
      .update({ status: ModifyRequestStatus.ACCEPTED })
      .then(() => {
        const noti: Notification = {
          id: '',
          user: request.creatorId,
          date: Timestamp.fromDate(new Date()),
          new: true,
          title: 'Elfogadott módosítási kérés!',
          type: NotificationType.MODIFY_REQUEST,
          linkedEntityId: request.id,
          description:
            request.noteTitle + 'című jegyzethez küldött módosítási kérésedet a szerző elfogadta és nemsokára nekiáll a javításnak.',
        };
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeresen elfogadtad a módosítási kérést!');
      });

    return data;
  }

  /**Módosítási kérés befejezése:
   * Egy módosítási kérés akkor lehet befejezett, ha a jegyzet szerzője elvégezte a kért módosításokat.
   * @param request a befejezni kívánt módosítási kérés.
   */
  async doneModifyRequest(request: ModifyRequest) {
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
      .doc(request.id)
      .update({ status: ModifyRequestStatus.DONE })
      .then(() => {
        const noti: Notification = {
          id: '',
          user: request.creatorId,
          date: Timestamp.fromDate(new Date()),
          new: true,
          title: 'Befejezett módosítási kérés!',
          type: NotificationType.MODIFY_REQUEST,
          linkedEntityId: request.id,
          description: request.noteTitle + 'című jegyzethez küldött módosítási kérésedhez tartazó javításokat a szerző elvégezte.',
        };
        this.noteService.reduceUpdateRequestsNumber(request.noteId);
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeres befejezted a módosítási kérést!');
      });

    return data;
  }

  /**Módosítási kérés elutasítása:
   * @param request az elutasítani kívánt módosítási kérés.
   * @param description az elutasítás indoka
   */
  async declineModifyRequest(request: ModifyRequest, description: string) {
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
      .doc(request.id)
      .update({ status: ModifyRequestStatus.DECLINED, declineNote: description })
      .then(() => {
        const noti: Notification = {
          id: '',
          user: request.creatorId,
          date: Timestamp.fromDate(new Date()),
          new: true,
          title: 'Elutasított módosítási kérés!',
          type: NotificationType.MODIFY_REQUEST,
          linkedEntityId: request.id,
          description: request.noteTitle + 'című jegyzethez küldött módosítási kérésedet a szerző elutasította.',
        };
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeresen elutasítottad a módosítási kérést!');
      });

    return data;
  }

  /** Módosítási kérés törlése:
   * Módosítási kérést a módosítási kérés szerzője tudja tötlni amennyiben
   * a módosítási kérés státusz elutasított (DECLINE) vagy befejezett (DONE) állapotú.
   * @param request a törölni kívánt módosítási kérés.
   *
   */
  async deleteModifyRequest(request: ModifyRequest) {
    const data = await this.store
      .collection<ModifyRequest>(this.collectionName)
      .doc(request.id)
      .delete()
      .then(() => {
        this.noteService.deleteRequest(request);
        this.toastService.success('Sikeresen törölted a módosítási kérést!');
        if (request.status === ModifyRequestStatus.SUBMITTED) {
          this.noteService.reduceUpdateRequestsNumber(request.noteId);
        }
      });

    return data;
  }

  async deleteModifyRequestById(requestId: string) {
    const data = await this.store.collection<ModifyRequest>(this.collectionName).doc(requestId).delete();

    return data;
  }
}
