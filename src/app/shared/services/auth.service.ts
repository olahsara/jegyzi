import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
/** Authentikációért felelős szolgáltatás */
export class AuthService {
  auth = inject(AngularFireAuth);
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

  /** Törlés */
  deleteAuth() {
    this.auth.user.subscribe((user) => user?.delete());
  }

  /**
   * Új jelszót igénylő email küldése
   * @param email a felhasználó e-mail címe
   */
  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email, { url: 'https://jegyzi-2024.web.app/login' });
  }

  /**
   * Új jelszót igénylő kód ellenőrzése
   * @param code a kód
   */
  verifyPasswordCode(code: string) {
    return this.auth.verifyPasswordResetCode(code);
  }

  /**
   * Új jelszó beállítása
   * @param actionCode a kód
   * @param newPassword az új jelszó
   */
  confirmPasswordReset(actionCode: string, newPassword: string) {
    return this.auth.confirmPasswordReset(actionCode, newPassword);
  }
}
