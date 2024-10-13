import { Timestamp } from '@angular/fire/firestore';

export interface Comment {
  id: string;
  comment: string;
  date: Timestamp;
  previousComment: string; //comment id
  creator: string; //user id
  note: string; //note id
  //reagálás?
}
