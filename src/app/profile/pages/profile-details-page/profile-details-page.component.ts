import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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
  profile = this.pageService.profile;

  readonly profileTypes = ProfileTypes;

  loggedInUser = this.userService.user();
  followedUser = computed(() => (this.loggedInUser?.follow.find((e) => e === this.profile().id) ? true : false));

  constructor(private userService: UserService) {}

  follow() {
    this.userService.followUser(this.profile());
  }
  unFollow() {
    this.userService.unFollowUser(this.profile());
  }
}
