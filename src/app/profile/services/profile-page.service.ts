import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class ProfilePageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  readonly profile = signal<User>(this.activatedRoute.snapshot.data['profile']);
  readonly id = signal<string>(this.activatedRoute.snapshot.params['id'] as string);

  reload(updated?: User) {
    if (updated) {
      this.profile.set(updated);
    } else {
      this.getProfile().then((value) => {
        this.profile.set(value);
      });
    }
  }

  async getProfile() {
    const data = await this.userService.getUserById(this.id());
    return data[0];
  }
}
