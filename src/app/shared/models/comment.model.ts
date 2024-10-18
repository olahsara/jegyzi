import { Timestamp } from '@angular/fire/firestore';

export interface Comment {
  id: string;
  comment: string;
  date: Timestamp;
  previousComment?: string; //comment id
  creatorId: string; //user id
  creatorame: string;
  note: string; //note id
  //reagálás?
}
