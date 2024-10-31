import { Timestamp } from '@angular/fire/firestore';

export interface Comment {
  id: string;
  comment: string;
  date: Timestamp;
  lastModified?: Timestamp;
  creatorId: string; //user id
  creatorProfilPic: boolean;
  creatorName: string;
  note: string; //note id
  //reagálás?
}

export interface CommentUpdateRequest {
  comment: string;
  lastModified?: Timestamp;
}
