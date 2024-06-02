import { Inject, Injectable, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private STORAGE_UID_KEY = 'uid'
  myProfile?: Observable<User | undefined>;

  constructor(private auth: AngularFireAuth, private store: AngularFirestore,  @Optional() @Inject(LOCAL_STORAGE) private storage?: Storage,) { }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  loggedInUser() {
    return this.auth.user
  }

  logout() {
    this.setUid(undefined);
    this.myProfile = undefined;
    return this.auth.signOut();
  }

  setProfile() {
    if(this.getUid()){
      this.myProfile = this.store.collection<User>('Users').doc(this.getUid()).get().pipe(map((value) => {return value.data()}))
    } else {
      this.myProfile = undefined
    }
  }

  createProfile(user: firebase.default.User | null) {
    if(user){
      return this.store.collection<User>('Users').doc(user.uid).set({email: user.email!, id: user.uid })
    }
    return;
  }

  setUid(uid: string | undefined): void {
    if (!this.storage) {
      return;
    }

    if(uid){
      this.storage?.setItem(this.STORAGE_UID_KEY, uid)
    
    } else {
      this.storage?.setItem(this.STORAGE_UID_KEY, '')
    } 
  }

  getUid(): string | undefined {
    if (!this.storage) {
      return undefined;
    }

    const uid = this.storage.getItem(this.STORAGE_UID_KEY) as string | null;

    if (uid) {
      return uid;
    }

    return undefined;
  }

}