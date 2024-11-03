import { Timestamp } from '@angular/fire/firestore';

export interface Comment {
  id: string;
  comment: string;
  date: Timestamp;
  lastModified?: Timestamp;
  creatorId: string;
  creatorProfilPic: boolean;
  creatorName: string;
  note: string;
}

export interface CommentUpdateRequest {
  comment: string;
  lastModified?: Timestamp;
}
