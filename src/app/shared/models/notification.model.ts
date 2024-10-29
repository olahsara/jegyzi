import { Timestamp } from '@angular/fire/firestore';

/**
 * TODO: értesítés küldés:
 * -ha új hozzászólás értkezik egy jegyzethez: értesítés a jegyzet követőinek
 * -ha új módosítási kérés egy jegyzethez: értesítés a jegyzet szerzőjének
 * -ha elfogadásra / elutasításra került egy módosítási kérés: értesítés a m. d. szerzőjének
 * */

export interface Notification {
  id: string;
  type: NotificationType;
  user: string;
  date: Timestamp;
  new: boolean;
  title: string;
  description?: string;
  linkedEntityId?: string; //kommentnél: a jegyzet id-ja, módosítási kérés: m. k. id
}

export enum NotificationType {
  'REVIEW',
  'MODIFY_REQUEST',
  'COMMENT',
  'NEW_FOLLOWER',
  'NEW_NOTE',
  'OTHER',
}
