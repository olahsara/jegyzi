import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { UserService } from '../../../shared/services/user.service';
import { getName } from '../../../shared/utils/name';
import { toDatePipe } from '../../pipes/to-date.pipe';
import { NotePageService } from '../../services/note-page.service';

@Component({
  selector: 'jegyzi-note-details-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    ReactiveFormsModule,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    QuillEditorComponent,
    MatTooltip,
    MatExpansionModule,
    MatCheckboxModule,
    RatingComponent,
    MatInput,
  ],
  templateUrl: './note-details-page.component.html',
  styleUrl: './note-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotePageService],
})
export class NoteDetailsPageComponent {
  private userService = inject(UserService);
  private pageService = inject(NotePageService);

  note = this.pageService.note;
  loggedInUser = this.userService.user;
  followedNote = signal(false);

  noteForm = new FormControl<string | null>(null);

  filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    numberOfNotes: new FormControl<number | null>(null),
    numberOfFollowers: new FormControl<number | null>(null),
    profileType: new FormControl<string | null>(null),
    educationYear: new FormControl<number | null>(null),
    educationType: new FormControl<string | null>(null),
  });

  reviewForm = new FormGroup({
    anonim: new FormControl<boolean | null>(null),
    userId: new FormControl<string | null>(null),
    userName: new FormControl<string | null>(null),
    submitDate: new FormControl<Timestamp>(Timestamp.fromDate(new Date()) as Timestamp),
    stars: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
  });

  constructor() {
    effect(() => {
      const note = this.note();
      const loggedInUser = this.loggedInUser();

      untracked(() => {
        this.noteForm.setValue(note.note);
        this.followedNote.set(loggedInUser ? (note.followers.find((e) => e === loggedInUser.id) ? true : false) : false);
      });
    });
  }

  follow() {
    this.userService.followNote(this.note()).finally(() => {
      this.pageService.reload();
    });
  }

  unFollow() {
    this.userService.unFollowNote(this.note()).finally(() => {
      this.pageService.reload();
    });
  }

  selectStar(rating: number) {
    this.reviewForm.controls.stars.setValue(rating);
  }

  modifyRequest() {}

  newReview() {
    if (!this.reviewForm.value.anonim) {
      this.reviewForm.controls.userId.setValue(this.loggedInUser()?.id!);
      this.reviewForm.controls.userName.setValue(getName(this.loggedInUser()!));
    }
  }
}
