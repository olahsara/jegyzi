import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  OnInit,
} from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'jegyzi-profile-details-page',
  standalone: true,
  templateUrl: './profile-details-page.component.html',
  styleUrl: './profile-details-page.component.scss',
  imports: [CommonModule, AvatarComponent, NamePipe, RouterLink, MatTooltip],
})
export class ProfileDetailsPageComponent {
  @Input() profile?: User;
  followedUser = computed(() =>
    this.userService.user()?.follow.find((e) => e === this.profile?.id)
      ? true
      : false
  );

  constructor(private userService: UserService) {}

  follow() {
    this.userService.followUser(this.profile!);
  }
  unFollow() {
    this.userService.unFollowUser(this.profile!);
  }
}
