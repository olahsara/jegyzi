import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Note } from '../../models/note.model';
import { toDatePipe } from '../../pipes/to-date.pipe';
import { UserService } from '../../services/user.service';
import { AvatarComponent } from '../avatar/avatar/avatar.component';
import { RatingComponent } from '../rating-component/rating.component';

@Component({
  selector: 'jegyzi-note-list',
  standalone: true,
  imports: [CommonModule, RatingComponent, toDatePipe, AvatarComponent, RouterLink, MatTooltip],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent {
  private userService = inject(UserService);

  /** Bejelentkezett felhasználó */
  loggedInUser = this.userService.user;

  /** Jegyzetek listája */
  notes = input.required<Note[]>();

  /** Saját jegyzetek listája-e */
  myNotes = input<boolean>(false);

  /** Kártyák megjelenítése egymás mellett (2db, után új sorban) */
  row = input(false);
}
