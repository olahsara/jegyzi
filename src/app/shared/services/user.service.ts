import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { Note } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { User, UserFilterModel } from '../models/user.model';
import { getName } from '../utils/name';
import { NoteService } from './note.service';
import { NotificationService } from './notifictaion.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly collectionName = 'Users';
  private notificationService = inject(NotificationService);
  private noteService = inject(NoteService);
  private store = inject(AngularFirestore);
  private toastService = inject(ToastService);
  private storage = inject(AngularFireStorage);

  user: WritableSignal<User | undefined> = signal(undefined);

  refreshLoggedInUser(id: string) {
    this.getUserById(id).then((value) => {
      if (value) {
        this.user.set(value[0]);
      }
    });
  }

  async getTopUsers(): Promise<User[]> {
    const data = await this.store
      .collection<User>(this.collectionName)
      .ref.orderBy('followersNumber', 'desc')
      .limit(3)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  async getAllUsers() {
    const data = await this.store
      .collection<User>(this.collectionName)
      .ref.orderBy('followersNumber', 'desc')
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  async getUsersByFilter(filter: UserFilterModel): Promise<User[]> {
    let result = this.store.collection<User>(this.collectionName).ref as Query<User>;
    if (filter.name) {
      const firstName = filter.name.split(' ')[1];
      const lastName = filter.name.split(' ')[0];
      if (firstName) result = result.where('firstName', '==', firstName);
      if (lastName) result = result.where('lastName', '==', lastName);
    }
    if (filter.numberOfFollowers) result = result.where('numberOfFollowers', '==', filter.numberOfFollowers);
    if (filter.numberOfNotes) result = result.where('numberOfNotes', '==', filter.numberOfNotes);
    if (filter.profileType) result = result.where('profileType', '==', filter.profileType);
    if (filter.educationType) result = result.where('education.type', '==', filter.educationType);
    if (filter.educationYear) result = result.where('education.year', '==', filter.educationYear);

    const data = await result.get().then((data) => {
      return data.docs.map((e) => {
        return e.data();
      });
    });

    return data;
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

    //Felhasználó követőihez adjuk hozzá a bejelentkezett felhasználót és küldjünk neki értesítést a követésről
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
      })
      .then(() => {
        const noti: Notification = {
          date: Timestamp.fromDate(new Date()),
          id: 'id',
          new: true,
          title: 'Új követés!',
          description: getName(this.user()!) + ' bekövetett téged!',
          type: NotificationType.NEW_FOLLOWER,
          user: followedUser.id,
          linkedEntityId: this.user()?.id,
        };
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeres követés!');
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

  async followNote(note: Note) {
    //Bejelentkezett felhasználó követésihez adjuk új jegyzetet
    let newFollowings: string[] = [];
    if (this.user()?.followedNotes) {
      this.user()?.followedNotes.push(note.id);
      newFollowings = this.user()?.followedNotes!;
    } else {
      newFollowings = [note.id];
    }

    this.store.collection(this.collectionName).doc(this.user()?.id).update({
      followedNotes: newFollowings,
    });

    //A jegyzet követéseit növeljük, a szerzőnek küldjünk értesítést a követésről
    return await this.noteService.addNewFollower(this.user()!, note);
  }

  async unFollowNote(note: Note) {
    //Bejelentkezett felhasználó követésiből kitöröljük a felhasználót
    const newFollowings = this.user()?.followedNotes!.filter((id) => id !== note.id);

    this.store.collection(this.collectionName).doc(this.user()?.id).update({
      followedNotes: newFollowings,
    });

    //Felhasználó követőiből kitöröljük a bejelentkezett felhasználót
    return await this.noteService.deleteFollower(this.user()!, note);
  }

  async uploadProfilPic(img: File, id: string): Promise<User[]> {
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
    this.storage.ref('profiles/' + id).delete();
    return this.store.collection(this.collectionName).doc(id).update({
      profilePicture: false,
    });
  }

  async createNote(user: User) {
    return await this.store
      .collection<User>(this.collectionName)
      .doc(user.id)
      .update({ notesNumber: user.notesNumber + 1 });
  }
}
