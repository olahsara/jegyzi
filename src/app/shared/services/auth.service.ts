import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private store: AngularFirestore, private userService: UserService) {}

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  loggedInUser() {
    return this.auth.user;
  }

  logout() {
    this.userService.user.set(undefined);
    return this.auth.signOut();
  }

  createProfile(user: User) {
    if (user) {
      return this.store
        .collection<User>('Users')
        .doc(user.id)
        .set(user)
        .then(() => {});
    }
    return;
  }
}
