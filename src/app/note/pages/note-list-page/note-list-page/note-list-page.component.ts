import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar/avatar.component';
import { TitleComponent } from '../../../../shared/components/title/title.component';
import { NoteService } from '../../../../shared/services/note.service';
import { toDatePipe } from '../../../pipes/to-date.pipe';

@Component({
  selector: 'jegyzi-note-list-page',
  standalone: true,
  imports: [CommonModule, TitleComponent, ReactiveFormsModule, RouterLink, AvatarComponent, toDatePipe],
  templateUrl: './note-list-page.component.html',
  styleUrl: './note-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteListPageComponent {
  noteService = inject(NoteService);
  notes$ = this.noteService.getNotes();

  filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    numberOfNotes: new FormControl<number | null>(null),
    numberOfFollowers: new FormControl<number | null>(null),
    profileType: new FormControl<string | null>(null),
    educationYear: new FormControl<number | null>(null),
    educationType: new FormControl<string | null>(null),
  });

  filter() {
    //TODO: filter
  }
}
