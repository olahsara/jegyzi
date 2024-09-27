import { Injectable, WritableSignal, signal } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { User } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly collectionName = 'Users';
  user: WritableSignal<User | undefined> = signal(undefined);

  constructor(private store: AngularFirestore, private toastService: ToastService, private storage: AngularFireStorage) {}

  async getTopUsers(): Promise<User[]> {
    let users: User[] = [];
    const data = await this.store.collection<User>(this.collectionName).ref.orderBy('followersNumber', 'desc').limit(3).get();

    if (data) {
      data.docs.forEach((element) => {
        users.push(element.data());
      });
    }
    return users;
  }

  async getAllUsers() {
    let users: User[] = [];
    const data = await this.store.collection<User>(this.collectionName).ref.orderBy('followersNumber', 'desc').get();

    if (data) {
      data.docs.forEach((element) => {
        users.push(element.data());
      });
    }
    return users;
  }

  async getUserById(id: string): Promise<User[]> {
    const data = await this.store
      .collection<User>(this.collectionName)
      .ref.where('id', '==', id)
      .limit(1)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  async modifyUser(newValue: User) {
    return await this.store
      .collection<User>(this.collectionName)
      .doc(this.user()!.id)
      .update(newValue)
      .then((data) => {
        this.toastService.success('Profil módosítása sikeresen megtörtént!');
      })
      .catch((error) => {
        this.toastService.error('Hiba a profil módosítása során!');
        console.log(error);
      });
  }

  async followUser(followedUser: User) {
    //Bejelentkezett felhasználó követésihez adjuk hozzá az új felhasználót
    let newFollowings: string[] = [];
    if (this.user()?.follow) {
      this.user()?.follow.push(followedUser.id);
      newFollowings = this.user()?.follow!;
    } else {
      newFollowings = [followedUser.id];
    }

    this.store.collection(this.collectionName).doc(this.user()?.id).update({
      follow: newFollowings,
    });

    //Felhasználó követőihez adjuk hozzá a bejelentkezett felhasználót
    let newFollowers: string[] = [];
    if (followedUser.followers) {
      followedUser.followers.push(this.user()?.id!);
      newFollowers = followedUser.followers;
    } else {
      newFollowers = [this.user()?.id!];
    }

    return await this.store
      .collection(this.collectionName)
      .doc(followedUser.id)
      .update({
        followers: newFollowers,
        followersNumber: followedUser.followersNumber + 1,
      });
  }

  async unFollowUser(followedUser: User) {
    //Bejelentkezett felhasználó követésiből kitöröljük a felhasználót
    const newFollowings = this.user()?.follow!.filter((userId) => userId !== followedUser.id);

    this.store.collection(this.collectionName).doc(this.user()?.id).update({
      follow: newFollowings,
    });

    //Felhasználó követőiből kitöröljük a bejelentkezett felhasználót
    const newFollowers = followedUser.followers.filter((userId) => userId !== this.user()?.id);

    return await this.store
      .collection(this.collectionName)
      .doc(followedUser.id)
      .update({
        followers: newFollowers,
        followersNumber: followedUser.followersNumber - 1,
      });
  }

  async uploadProfilPic(img: File, id: string) {
    return await this.storage
      .ref('profiles/' + id)
      .put(img)
      .then(() => {
        this.store.collection(this.collectionName).doc(this.user()?.id).update({
          profilePicture: true,
        });
      });
  }

  getProfilPic(id: string) {
    return this.storage.ref('profiles/' + id).getDownloadURL();
  }

  deleteProfilPic(id: string) {
    this.storage
      .ref('profiles/' + id)
      .delete()
      .subscribe(() => {
        this.store.collection(this.collectionName).doc(this.user()?.id).update({
          profilePicture: false,
        });
      });
  }
}
