import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class MyProfilePageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  readonly profile = this.userService.user;

  reload(updated?: User) {
    const value = updated ? updated : this.getProfile();
    this.profile.set(value);
  }

  getProfile() {
    const data = this.userService.user();
    return data;
  }
}
