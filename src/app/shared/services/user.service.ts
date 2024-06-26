import { Injectable, Optional, Inject, WritableSignal, signal } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly collectionName = 'Users';
  user: WritableSignal<User | undefined> = signal(undefined);

  constructor(
    private store: AngularFirestore,
    private toastService: ToastService,
    @Optional() @Inject(LOCAL_STORAGE) private storage?: Storage,
    
  ) {}

  async getTopUsers(): Promise<User[]> {
    let users: User[] = [];
    const data = await this.store
      .collection<User>(this.collectionName)
      .ref.orderBy('followersNumber', 'desc')
      .limit(3)
      .get();

    if (data) {
      data.docs.forEach((element) => {
        users.push(element.data())
      })
    }
    return users;
  }

  async getAllUsers() {
    let users: User[] = [];
    const data = await this.store
      .collection<User>(this.collectionName)
      .ref.orderBy('followersNumber', 'desc')
      .get();

    if (data) {
      data.docs.forEach((element) => {
        users.push(element.data())
      })
    }
    return users;
  }

  getUserById(
    id: string
  ): Promise<firebase.default.firestore.QuerySnapshot<User>> {
    return this.store
      .collection<User>(this.collectionName)
      .ref.where('id', '==', id)
      .limit(1)
      .get();
  }

  async modifyUser(newValue: User) {
    try {
      return await this.store
        .collection<User>(this.collectionName)
        .doc(newValue.id)
        .set(newValue);
    } catch {
      this.toastService.error('Hiba a profil módosítása során!');
    }
  }
}
