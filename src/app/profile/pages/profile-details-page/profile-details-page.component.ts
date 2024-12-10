import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { NoteListComponent } from '../../../shared/components/note-list/note-list.component';
import { ProfileTypes } from '../../../shared/models/user.model';
import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { NoteService } from '../../../shared/services/note.service';
import { UserService } from '../../../shared/services/user.service';
import { ProfilePageService } from '../../services/profile-page.service';

@Component({
  selector: 'jegyzi-profile-details-page',
  standalone: true,
  templateUrl: './profile-details-page.component.html',
  styleUrl: './profile-details-page.component.scss',
  imports: [CommonModule, AvatarComponent, MatTooltip, NoteListComponent, NoValuePipe],
  providers: [ProfilePageService],
})
export class ProfileDetailsPageComponent {
  private pageService = inject(ProfilePageService);
  private userService = inject(UserService);
  private noteService = inject(NoteService);

  readonly profileTypes = ProfileTypes;

  /** A profil lekérése a komponens szolgáltatásától */
  profile = this.pageService.profile;

  loggedInUser = this.userService.user;

  /** A bejelentkezett felhasználó követi-e a részletes oldalon megjelenő felhasználót */
  followedUser = signal(false);

  /** Részletes oldalon megtekintett felhasználó által írt jegyzetek */
  notes = computed(() => this.noteService.getNotesByUser(this.profile().id));

  /** Követés állapotának beállítása a felhasználó aktuális és frissülő adatai alapján */
  constructor() {
    explicitEffect([this.profile], ([profile]) => {
      this.followedUser.set(this.loggedInUser() ? (profile.followers.find((e) => e === this.loggedInUser()?.id) ? true : false) : false);
    });
  }

  /** Felhasználó bekövetése */
  follow() {
    this.userService.followUser(this.profile()).then(() => {
      this.pageService.reload();
    });
  }

  /** Felhasználó kikövetése */
  unFollow() {
    this.userService.unFollowUser(this.profile()).then(() => {
      this.pageService.reload();
    });
  }
}
