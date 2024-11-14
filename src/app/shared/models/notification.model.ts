import { Timestamp } from '@angular/fire/firestore';

/** Értesítés kollekció */
export interface Notification {
  id: string;
  type: NotificationType;
  user: string;
  date: Timestamp;
  new: boolean;
  title: string;
  description?: string;
  linkedEntityId?: string;
}

/** Értesítés típusai */
export enum NotificationType {
  'REVIEW',
  'MODIFY_REQUEST',
  'COMMENT',
  'NEW_FOLLOWER',
  'NEW_NOTE',
  'OTHER',
  'UPDATED_NOTE',
}
