import { Timestamp } from '@angular/fire/firestore';

export interface Review {
  id: string;
  anonim: boolean;
  userId: string;
  noteId: string;
  userName: string;
  submitDate: Timestamp;
  stars: number;
  description?: string;
}
