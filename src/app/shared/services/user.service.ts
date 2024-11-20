import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { catchError, Observable, of } from 'rxjs';
import { Note } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { User, UserFilterModel } from '../models/user.model';
import { NoteService } from './note.service';
import { NotificationService } from './notifictaion.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
/**Felhasználókat kezelő szolgáltatás*/
export class UserService {
  readonly collectionName = 'Users';
  private notificationService = inject(NotificationService);
  private noteService = inject(NoteService);
  private store = inject(AngularFirestore);
  private toastService = inject(ToastService);
  private storage = inject(AngularFireStorage);
  private STORAGE_THEME_KEY = 'user';
  private localstorage = inject<Storage>(LOCAL_STORAGE, { optional: true });

  user: WritableSignal<User | undefined> = signal(undefined);

  /**
   * Beállítja a bejelentkezett felhasználót és a localstorage-ben a bejelentkezett felhasználó id-ját.
   * @param user a felhasználó
   */
  setUser(user: User | undefined) {
    this.user.set(user);
    if (this.localstorage) {
      this.localstorage.setItem(this.STORAGE_THEME_KEY, user ? user.id : '');
    }
  }

  /**
   * Létrehoz egy új felhasználót.
   * @param user a létrehozni kívánt felhasználó adatai
   */
  async createProfile(user: User) {
    return this.store
      .collection<User>(this.collectionName)
      .doc(user.id)
      .set(user)
      .then(() => {
        this.setUser(user);
      });
  }

  /**
   * Lekéri a 3 legtöbb követővel rendelkező felhasználót.
   * @returns a 3db felhasználó
   */
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
  /**
   * Lekéri az összes felhasználót.
   * @returns az összes felhasználó
   */
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

  /**
   * Lekéri a megfelelő adatokkal rendelkező felhasználókat
   * @param filter az adatok, amikkel rendelkeznie kell a lekért felhasználóknak
   * @returns a leszűrt felhasználó lista
   */
  async getUsersByFilter(filter: UserFilterModel): Promise<User[]> {
    let result = this.store.collection<User>(this.collectionName).ref as Query<User>;
    if (filter.name) result = result.where('name', '==', filter.name);
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

  /**
   * Felhasználó lekérése id alapján
   * @param id a lekérni kívánt felhasználó id-ja
   * @returns a felhasználó
   */
  async getUserById(id: string): Promise<User> {
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

    return data[0];
  }

  /**
   * Felhasználó módosítása
   * @param newValue a módosított adatok
   */
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

  /**
   * Felhasználó bekövetése
   * @param followedUser a bekövetett felhasználó
   */
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
          description: this.user()?.name + ' bekövetett téged!',
          type: NotificationType.NEW_FOLLOWER,
          user: followedUser.id,
          linkedEntityId: this.user()?.id,
        };
        this.notificationService.createNotification(noti);
        this.toastService.success('Sikeres követés!');
      });
  }

  /**
   * Felhasználó kikövetése
   * @param followedUser a kikövetni kívánt felhasználó
   */
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

  /**
   * Jegyzet bekövetése
   * @param note a bekövetni kívánt jegyzet
   */
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

  /**
   * Jegyzet kikövetése
   * @param note a kikövetni kívánt jegyzet
   */
  async unFollowNote(note: Note) {
    //Bejelentkezett felhasználó követésiből kitöröljük a felhasználót
    const newFollowings = this.user()?.followedNotes!.filter((id) => id !== note.id);

    this.store.collection(this.collectionName).doc(this.user()?.id).update({
      followedNotes: newFollowings,
    });

    //Felhasználó követőiből kitöröljük a bejelentkezett felhasználót
    return await this.noteService.deleteFollower(this.user()!, note);
  }

  /**
   * Profilkép feltöltése
   * @param img a kép
   * @param id a felhasználó id-ja
   * @returns
   */
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

  /**
   * Profilkép lekérése
   * @param id a felhasználó id-ja
   * @returns a lekért profikép
   */
  getProfilPic(id: string): Observable<string | null> {
    return this.storage
      .ref('profiles/' + id)
      .getDownloadURL()
      .pipe(catchError(() => of(null)));
  }

  /**
   * Profilkép törlése
   * @param id a felhasználó id-ja
   */
  deleteProfilPic(id: string) {
    this.storage.ref('profiles/' + id).delete();
    return this.store.collection(this.collectionName).doc(id).update({
      profilePicture: false,
    });
  }

  /**
   * Jegyzet készítése esetén a felhasználónál növelni kell a jegyzetek számát
   * @param user a jegyzet szerzője
   */
  async createNote(user: User) {
    return await this.store
      .collection<User>(this.collectionName)
      .doc(user.id)
      .update({ notesNumber: user.notesNumber + 1 });
  }

  /**
   * Jegyzet törlése esetén követés törlése
   * @param note a jegyzet
   * @param userId a felhasználó id-ja akinél törölni kell a követésekből
   */
  async deleteNote(note: Note, userId: string) {
    const user = await this.getUserById(userId);

    if (user) {
      const newFollowings = user.followedNotes.filter((id) => id !== note.id);
      this.store.collection(this.collectionName).doc(user.id).update({
        followedNotes: newFollowings,
      });
    }
  }

  /**
   * Jegyzetszám csökkentése
   * @param userId a felhasználó id-ja akinél csökkenteni kell
   */
  async reduceNoteNumber(userId: string) {
    const user = await this.getUserById(userId);

    if (user) {
      this.store
        .collection(this.collectionName)
        .doc(user.id)
        .update({
          notesNumber: user.notesNumber - 1,
        });
    }
  }
}
