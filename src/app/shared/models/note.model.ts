import { Timestamp } from '@angular/fire/firestore';
import { LabelNote } from './label.model';

/** Jegyzet kollekció */
export interface Note {
  id: string;
  title: string;
  subTitle?: string;
  note: string;
  labels: LabelNote[];
  creatorId: string;
  created: Timestamp;
  followers: string[];
  followersNumber: number;
  comments: string[];
  reviews: string[];
  updateRequests: string[];
  numberOfUpdateRequests: number;
  lastModify?: Timestamp;
  avarageStar: number;
}

/** Jegyzet szűrésének az interfésze */
export interface NoteFilterModel {
  title: string;
  stars: number;
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
