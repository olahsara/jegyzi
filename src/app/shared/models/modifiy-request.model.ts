import { Timestamp } from '@angular/fire/firestore';

export interface ModifyRequest {
  id: string;
  date: Timestamp;
  seriousness: ModifyRequestSeriusness;
  creatorId: string;
  creatorName: string;
  noteId: string;
  noteTitle: string;
  noteCreator: string; //user id
  status: ModifyRequestStatus;
  declineNote?: string;
}

export enum ModifyRequestStatus {
  'SUBMITTED' = 'Beküldött',
  'IN_PROGRESS' = 'Folyamatban',
  'ACCEPTED' = 'Elfogadott',
  'DECLINED' = 'Elutasított',
  'DONE' = 'Befejezett',
}

export enum ModifyRequestSeriusness {
  'LOW' = 'Enyhe',
  'MEDIUM' = 'Közepes',
  'HIGH' = 'Súlyos',
}
