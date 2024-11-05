import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterLink } from '@angular/router';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { LabelGroupComponent } from '../../../shared/components/label-group/label-group.component';
import { NoteListComponent } from '../../../shared/components/note-list/note-list.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { LabelNote } from '../../../shared/models/label.model';
import { NoteFilterModel } from '../../../shared/models/note.model';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { LabelService } from '../../../shared/services/label.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { MyNotesPageService } from '../../services/my-notes-page.service';

@Component({
  selector: 'jegyzi-my-notes-list-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    FORM_DIRECTIVES,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    LabelGroupComponent,
    NamePipe,
    MatDatepickerModule,
    RatingComponent,
    NoteListComponent,
  ],
  templateUrl: './my-notes-list-page.component.html',
  styleUrl: './my-notes-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter(), MyNotesPageService],
})
export class MyNotesListPageComponent {
  private userService = inject(UserService);
  private labelService = inject(LabelService);
  private pageService = inject(MyNotesPageService);

  notes$ = this.pageService.notes$;
  labels$ = this.labelService.getLabels();
  users$ = this.userService.getAllUsers();

  filterForm = new FormGroup({
    title: new FormControl<string | null>(null),
    stars: new FormControl<number | null>(null),
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
    this.pageService.filter(this.filterForm.value as NoteFilterModel);
  }
  selectStar(star: number) {
    this.filterForm.controls.stars.setValue(star);
  }
}
