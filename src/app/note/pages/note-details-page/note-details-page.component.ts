import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { Comment } from '../../../shared/models/comment.model';
import { Review } from '../../../shared/models/review.model';
import { CommentService } from '../../../shared/services/comment.service';
import { ReviewService } from '../../../shared/services/review.service';
import { UserService } from '../../../shared/services/user.service';
import { NoteCommentComponent } from '../../components/note-comment/note-comment.component';
import {
  ModifyRequestModalData,
  NoteModifyRequestModalComponent,
} from '../../components/note-modify-request/note-modify-request.component';
import { NoteReviewComponent } from '../../components/note-review/note-review.component';
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
    NoteReviewComponent,
    NoteCommentComponent,
  ],
  templateUrl: './note-details-page.component.html',
  styleUrl: './note-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotePageService],
})
export class NoteDetailsPageComponent {
  private userService = inject(UserService);
  private pageService = inject(NotePageService);
  private reviewService = inject(ReviewService);
  private commentService = inject(CommentService);
  private dialog = inject(MatDialog);

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

  newReview(review: Review) {
    this.reviewService.createReview(review, this.note()).then((id) => {
      this.pageService.reload();
    });
  }

  newComment(comment?: Comment) {
    if (comment != undefined) {
      this.commentService.createComment(comment, this.note()).then(() => {
        this.pageService.reload();
      });
    } else {
      this.pageService.reload();
    }
  }

  modifyRequest() {
    this.dialog
      .open(NoteModifyRequestModalComponent, {
        minWidth: '50vw',
        data: { note: this.note(), creator: this.loggedInUser() } as ModifyRequestModalData,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) this.pageService.reload();
      });
  }
}
