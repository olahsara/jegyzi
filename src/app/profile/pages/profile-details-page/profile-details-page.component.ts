import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { AvatarComponent } from "../../../shared/components/avatar/avatar/avatar.component";
import { NamePipe } from "../../../shared/pipes/name.pipe";
import { RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'jegyzi-profile-details-page',
    standalone: true,
    templateUrl: './profile-details-page.component.html',
    styleUrl: './profile-details-page.component.scss',
    imports: [
        CommonModule,
        AvatarComponent,
        NamePipe,
        RouterLink
    ]
})
export class ProfileDetailsPageComponent { 
  @Input() profile?: User
  followedUser: boolean = false

  constructor(private userService: UserService) {
    if(this.userService.user()) {
      this.followedUser = this.userService.user()?.follow.find((e) => e === this.profile?.id)?true:false;
    } else {
      this.followedUser = false;
    }
  }

  follow() {
    this.userService.followUser(this.profile!);

  }
}
