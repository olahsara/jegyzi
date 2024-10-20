import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { LabelGroupComponent } from '../../../shared/components/label-group/label-group.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { LabelNote } from '../../../shared/models/label.model';
import { NoteFilterModel } from '../../../shared/models/note.model';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { LabelService } from '../../../shared/services/label.service';
import { NoteService } from '../../../shared/services/note.service';
import { UserService } from '../../../shared/services/user.service';
import { toDatePipe } from '../../pipes/to-date.pipe';

@Component({
  selector: 'jegyzi-note-list-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    ReactiveFormsModule,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    MatFormFieldModule,
    MatInputModule,
    LabelGroupComponent,
    MatSelectModule,
    NamePipe,
    MatDatepickerModule,
  ],
  templateUrl: './note-list-page.component.html',
  styleUrl: './note-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class NoteListPageComponent {
  noteService = inject(NoteService);
  private userService = inject(UserService);
  private labelService = inject(LabelService);

  notes$ = signal(this.noteService.getNotes());
  labels$ = this.labelService.getLabels();
  users$ = this.userService.getAllUsers();

  filterForm = new FormGroup({
    title: new FormControl<string | null>(null),
    labels: new FormControl<LabelNote[] | null>([]) as FormControl<LabelNote[]>,
    followersNumber: new FormControl<number | null>(null),
    creatorId: new FormControl<string | null>(null),
    createdDate: new FormGroup({
      createdDateMin: new FormControl<Timestamp | null>(null),
      createdDateMax: new FormControl<Timestamp | null>(null),
    }),
    lastModifiedDate: new FormGroup({
      lastModifiedMin: new FormControl<Timestamp | null>(null),
      lastModifiedMax: new FormControl<Timestamp | null>(null),
    }),
  });

  filter() {
    this.notes$.set(this.noteService.getNotesByFilter(this.filterForm.value as NoteFilterModel));
  }
}
