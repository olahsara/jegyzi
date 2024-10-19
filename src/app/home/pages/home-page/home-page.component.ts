import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { HeaderComponent } from '../../../shared/layout/header/header.component';
import { NamePipe } from '../../../shared/pipes/name.pipe';
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
    NamePipe,
    TypePipe,
    toDatePipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private noteService = inject(NoteService);

  user = toSignal(this.authService.loggedInUser());
  profiles$ = this.userService.getTopUsers();
  notes$ = this.noteService.getTopNotes();

  logout() {
    this.authService.logout();
  }
}
