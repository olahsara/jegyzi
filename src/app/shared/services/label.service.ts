import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LabelGroup } from '../models/label.model';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  readonly collectionName = 'Label';

  constructor(private store: AngularFirestore, private storage: AngularFireStorage) {}

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
