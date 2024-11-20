import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Injectable()
/** Bejelentekezett felhasználó részletes oldalát kezelő szolgáltatás  */
export class MyProfilePageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  /** A bejelentkezett felhasználó */
  readonly profile = this.userService.user;

  /**
   * A felhasználó adatainak újratöltése
   * @param updated a frissült adattal rendelkező felhasználó
   */
  reload(updated?: User) {
    const value = updated ? updated : this.getProfile();
    this.profile.set(value);
  }

  /** Felhasználó lekérése */
  getProfile() {
    const data = this.userService.user();
    return data;
  }
}
