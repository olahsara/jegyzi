import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LabelGroup } from '../models/label.model';

@Injectable({
  providedIn: 'root',
})
/** Címkéket kezelő szolgáltatás */
export class LabelService {
  readonly collectionName = 'Label';
  private store = inject(AngularFirestore);

  /**
   * Címkék lekérése
   * @returns címkék
   */
  async getLabels() {
    let labels: LabelGroup[] = [];
    const data = await this.store.collection<LabelGroup>(this.collectionName).ref.get();

    if (data) {
      data.docs.forEach((element) => {
        labels.push(element.data());
      });
    }
    return labels;
  }
}
