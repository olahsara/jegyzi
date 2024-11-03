import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { Note } from '../../models/note.model';
import { AvatarComponent } from '../avatar/avatar/avatar.component';
import { RatingComponent } from '../rating-component/rating.component';

@Component({
  selector: 'jegyzi-note-list',
  standalone: true,
  imports: [CommonModule, RatingComponent, toDatePipe, AvatarComponent, RouterLink],
  templateUrl: './note-list.component.html',
  styleUrl: './note-list.component.scss',
})
export class NoteListComponent {
  notes = input.required<Note[]>();
}
