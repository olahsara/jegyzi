import { Timestamp } from '@angular/fire/firestore';

export interface ModifyRequest {
  id: string;
  date: Timestamp;
  seriousness: number;
  creatorId?: string; //user id
  creatorName: string;
  note: string; //note id
  noteCreator: string; //user id
  status: ModifyRequestStatus;
  declineNote?: string;
}

export type ModifyRequestStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'ACCEPTED' | 'DECLINED';
