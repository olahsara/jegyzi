import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Injectable()
/** A felhasználó részletes oldalát kezelő szolgáltatás  */
export class ProfilePageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  /** A felhasználó (resolverből kapott) */
  readonly profile = signal<User>(this.activatedRoute.snapshot.data['profile']);
  readonly id = signal<string>(this.activatedRoute.snapshot.params['id'] as string);

  /**
   * A felhasználó adatainak újratöltése
   * @param updated a frissült adattal rendelkező felhasználó
   */
  reload(updated?: User) {
    if (updated) {
      this.profile.set(updated);
    } else {
      this.getProfile().then((value) => {
        this.profile.set(value);
      });
    }
  }

  /** Felhasználó lekérése */
  async getProfile() {
    const data = await this.userService.getUserById(this.id());
    return data;
  }
}
