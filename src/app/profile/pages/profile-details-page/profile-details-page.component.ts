import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'jegyzi-profile-details-page',
  standalone: true,
  templateUrl: './profile-details-page.component.html',
  styleUrl: './profile-details-page.component.scss',
  imports: [CommonModule, AvatarComponent, NamePipe, RouterLink, MatTooltip],
})
export class ProfileDetailsPageComponent {
  @Input() profile?: User;

  readonly profileTypes = ProfileTypes;

  loggedInUser = this.userService.user();
  followedUser = computed(() => (this.loggedInUser?.follow.find((e) => e === this.profile?.id) ? true : false));

  constructor(private userService: UserService) {}

  follow() {
    this.userService.followUser(this.profile!);
  }
  unFollow() {
    this.userService.unFollowUser(this.profile!);
  }
}
