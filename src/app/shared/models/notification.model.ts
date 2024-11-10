import { Timestamp } from '@angular/fire/firestore';

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

export enum NotificationType {
  'REVIEW',
  'MODIFY_REQUEST',
  'COMMENT',
  'NEW_FOLLOWER',
  'NEW_NOTE',
  'OTHER',
  'UPDATED_NOTE',
}
