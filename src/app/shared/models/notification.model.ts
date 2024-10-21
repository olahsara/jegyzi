import { Timestamp } from '@angular/fire/firestore';

export interface Notification {
  id: string;
  type: NotificationType;
  user: string; //user id
  // from?: string; //user id
  date: Timestamp;
  new: boolean;
  title: string;
  description?: string;
  linkedEntityId?: string; //kommentnél: a jegyzet id-ja, értékelésnél: értékelés id, új követőnél: követő id-ja, új jegyzetnél: jegyzet id, módosítási kérés: m. k. id
}

export enum NotificationType {
  'REVIEW',
  'MODIFY_REQUEST',
  'COMMENT',
  'NEW_FOLLOWER',
  'NEW_NOTE',
  'OTHER',
}
