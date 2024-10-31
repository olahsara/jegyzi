import { Timestamp } from '@angular/fire/firestore';
import { LabelNote } from './label.model';

export interface Note {
  id: string;
  title: string;
  subTitle?: string;
  note: string;
  labels: LabelNote[];
  creatorId: string;
  creatorProfilPic: boolean;
  created: Timestamp;
  followers: string[]; // felhasználók id-ja
  followersNumber: number;
  comments: string[]; //hozzászólás id
  reviews: string[]; //értékelések id-ja
  updateRequests: string[]; //módosítási javaslatok id-ja
  lastModify: Timestamp;
  avarageStar: number;
}

export interface NoteFilterModel {
  title: string;
  labels: LabelNote[];
  followersNumber: number;
  creatorId: string;
  createdDate: {
    createdDateMin: Timestamp;
    createdDateMax: Timestamp;
  };
  lastModifiedDate: {
    lastModifiedMin: Timestamp;
    lastModifiedMax: Timestamp;
  };
}
