import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { LabelGroupComponent } from '../../../shared/components/label-group/label-group.component';
import { NoteListComponent } from '../../../shared/components/note-list/note-list.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { LabelNote } from '../../../shared/models/label.model';
import { NoteFilterModel } from '../../../shared/models/note.model';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { LabelService } from '../../../shared/services/label.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { FollowedNotesPageService } from '../../services/followed-notes-page.service';

@Component({
  selector: 'jegyzi-followed-notes-list-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    FORM_DIRECTIVES,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    LabelGroupComponent,
    MatDatepickerModule,
    RatingComponent,
    NoteListComponent,
    MatExpansionModule,
  ],
  templateUrl: './followed-notes-list-page.component.html',
  styleUrl: './followed-notes-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter(), FollowedNotesPageService],
})
export class FollowedNotesListPageComponent {
  private userService = inject(UserService);
  private labelService = inject(LabelService);
  private pageService = inject(FollowedNotesPageService);

  /** A komponens szolgáltatásától lekért jegyzetek */
  notes$ = this.pageService.notes$;
  /** Címkék lekérése (szűréshez) */
  labels$ = this.labelService.getLabels();
  /** Felhasználók lekérése (szűréshez) */
  users$ = this.userService.getAllUsers();

  /** Űrlap szűréshez */
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

  /** Szűrés */
  filter() {
    this.pageService.filter(this.filterForm.value as NoteFilterModel);
  }

  /**
   *  Értékelés beállítása
   * @param star az értékelés nagysága
   */
  selectStar(star: number) {
    if (star === this.filterForm.value.stars) {
      this.filterForm.controls.stars.setValue(null);
    } else {
      this.filterForm.controls.stars.setValue(star);
    }
  }
}
