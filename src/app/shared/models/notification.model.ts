export interface Notification {
  id: string;
  type: NotificationType;
  user: string; //user id
  from?: string; //user id
  date: string;
  new: boolean;
  title: string;
  description?: string;
  linkedEntityId?: string; //kommentnél a jegyzet id-ja kerüljön ide
}

export type NotificationType = 'REVIEW' | 'MODIFY_REQUEST' | 'COMMENT' | 'NEW_FOLLOWER' | 'NEW_NOTE';
