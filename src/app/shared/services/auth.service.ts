import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(AngularFireAuth);
  private store = inject(AngularFirestore);
  private userService = inject(UserService);

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
    this.userService.setUser(undefined);
    return this.auth.signOut();
  }
}
