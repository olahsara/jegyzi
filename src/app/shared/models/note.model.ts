import { Timestamp } from '@angular/fire/firestore';
import { LabelNote } from './label.model';

export interface Note {
  id: string;
  title: string;
  subTitle?: string;
  note: string;
  labels: LabelNote[];
  creatorId: string;
  created: Timestamp;
  followers: string[]; // felhasználók id-ja
  followersNumber: number;
  comments: string[]; //hozzászólás id
  reviews: string[]; //értékelések id-ja
  updateRequests: string[]; //módosítási javaslatok id-ja
  lastModify: Timestamp;
}
