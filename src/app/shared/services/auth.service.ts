import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
/** Authentikációért felelős szolgáltatás */
export class AuthService {
  auth = inject(AngularFireAuth);
  private store = inject(AngularFirestore);
  private userService = inject(UserService);

  /**
   * Bejelentkezés
   * @param email e-mail cím
   * @param password jelszó
   * @return credentials
   */
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Regisztráció és bejelentkezés
   * @param email e-mail cím
   * @param password jelszó
   * @return credentials
   */
  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * Bejelentkezett felhasználó
   * @returns felhasználó
   */
  loggedInUser() {
    return this.auth.user;
  }

  /** Kijelentkezés */
  logout() {
    this.userService.setUser(undefined);
    return this.auth.signOut();
  }
}
