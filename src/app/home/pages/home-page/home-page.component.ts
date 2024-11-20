import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { NoteListComponent } from '../../../shared/components/note-list/note-list.component';
import { ProfileListComponent } from '../../../shared/components/profile-list/profile-list.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';

import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { TypePipe } from '../../../shared/pipes/type.pipe';
import { AuthService } from '../../../shared/services/auth.service';
import { NoteService } from '../../../shared/services/note.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'jegyzi-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TitleComponent,
    MatTooltip,
    RouterLink,
    NoValuePipe,
    AvatarComponent,
    TypePipe,
    toDatePipe,
    RatingComponent,
    NoteListComponent,
    ProfileListComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private noteService = inject(NoteService);

  /** Bejelentkezett felhasználó */
  user = toSignal(this.authService.loggedInUser());
  /** Legnépszerűbb felhasználók lista */
  profiles$ = this.userService.getTopUsers();
  /** Legnépszerűbb jegyzetek lista */
  notes$ = this.noteService.getTopNotes();

  /** Kijelentkezés */
  logout() {
    this.authService.logout();
  }
}
