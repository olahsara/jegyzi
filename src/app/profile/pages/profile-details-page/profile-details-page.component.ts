import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, untracked } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { ProfileTypes } from '../../../shared/models/user.model';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { UserService } from '../../../shared/services/user.service';
import { ProfilePageService } from '../../services/profile-page.service';

@Component({
  selector: 'jegyzi-profile-details-page',
  standalone: true,
  templateUrl: './profile-details-page.component.html',
  styleUrl: './profile-details-page.component.scss',
  imports: [CommonModule, AvatarComponent, NamePipe, RouterLink, MatTooltip],
  providers: [ProfilePageService],
})
export class ProfileDetailsPageComponent {
  private pageService = inject(ProfilePageService);
  private userService = inject(UserService);
  profile = this.pageService.profile;

  readonly profileTypes = ProfileTypes;

  loggedInUser = this.userService.user;
  followedUser = signal(false);

  constructor() {
    effect(() => {
      const profile = this.profile();
      untracked(() => {
        this.followedUser.set(this.loggedInUser() ? (profile.followers.find((e) => e === this.loggedInUser()?.id) ? true : false) : false);
      });
    });
  }

  follow() {
    this.userService.followUser(this.profile()).finally(() => {
      this.pageService.reload();
    });
  }
  unFollow() {
    this.userService.unFollowUser(this.profile()).finally(() => {
      this.pageService.reload();
    });
  }
}
