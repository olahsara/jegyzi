import { Timestamp } from '@angular/fire/firestore';

/** Komment kollekció */
export interface Comment {
  id: string;
  comment: string;
  date: Timestamp;
  lastModified?: Timestamp;
  creatorId: string;
  creatorName: string;
  note: string;
}

/** Komment módosításának az interfésze */
export interface CommentUpdateRequest {
  comment: string;
  lastModified?: Timestamp;
}
