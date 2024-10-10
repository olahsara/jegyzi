import { Timestamp } from '@angular/fire/firestore';

export interface ModifyRequest {
  id: string;
  date: Timestamp;
  seriousness: number;
  creator: string; //user id
  note: string; //note id
  noteCreator: string; //user is
  status: ModifyRequestStatus;
  declineNote?: string;
}

export type ModifyRequestStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'ACCEPTED' | 'DECLINED';
