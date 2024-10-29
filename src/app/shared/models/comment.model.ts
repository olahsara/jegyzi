import { Timestamp } from '@angular/fire/firestore';

export interface Comment {
  id: string;
  comment: string;
  date: Timestamp;
  creatorId: string; //user id
  creatorProfilPic: boolean;
  creatorName: string;
  note: string; //note id
  //reagálás?
}
