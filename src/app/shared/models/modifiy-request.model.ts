import { Timestamp } from '@angular/fire/firestore';

/** Módosítási kérés kollekció */
export interface ModifyRequest {
  id: string;
  date: Timestamp;
  seriousness: ModifyRequestSeriusness;
  creatorId: string;
  creatorName: string;
  noteId: string;
  noteTitle: string;
  noteCreator: string;
  description: string;
  status: ModifyRequestStatus;
  declineNote?: string;
}

/** Módosítási kérés státuszai */
export enum ModifyRequestStatus {
  'SUBMITTED' = 'Beküldött',
  'IN_PROGRESS' = 'Folyamatban',
  'ACCEPTED' = 'Elfogadott',
  'DECLINED' = 'Elutasított',
  'DONE' = 'Befejezett',
}

/** Módosítási kérés fokozatai */
export enum ModifyRequestSeriusness {
  'LOW' = 'Enyhe',
  'MEDIUM' = 'Közepes',
  'HIGH' = 'Súlyos',
}
