import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { NoteListComponent } from '../../../shared/components/note-list/note-list.component';
import { ProfileTypes } from '../../../shared/models/user.model';
import { NoteService } from '../../../shared/services/note.service';
import { UserService } from '../../../shared/services/user.service';
import { ProfilePageService } from '../../services/profile-page.service';

@Component({
  selector: 'jegyzi-profile-details-page',
  standalone: true,
  templateUrl: './profile-details-page.component.html',
  styleUrl: './profile-details-page.component.scss',
  imports: [CommonModule, AvatarComponent, RouterLink, MatTooltip, NoteListComponent],
  providers: [ProfilePageService],
})
export class ProfileDetailsPageComponent {
  private pageService = inject(ProfilePageService);
  private userService = inject(UserService);
  private noteService = inject(NoteService);

  readonly profileTypes = ProfileTypes;

  profile = this.pageService.profile;
  loggedInUser = this.userService.user;
  followedUser = signal(false);
  notes = computed(() => this.noteService.getNotesByUser(this.profile().id));

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
