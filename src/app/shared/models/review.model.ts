import { Timestamp } from '@angular/fire/firestore';

export interface Review {
  id: string;
  aninonim?: boolean;
  submitDate: Timestamp;
  stars: number;
  description?: string;
}
