import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { NoteCommentComponent } from '../../../note/components/note-comment/note-comment.component';
import { NoteReviewComponent } from '../../../note/components/note-review/note-review.component';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { Comment } from '../../../shared/models/comment.model';
import { CommentService } from '../../../shared/services/comment.service';
import { UserService } from '../../../shared/services/user.service';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';
import { MyNoteDetailsPageService } from '../../services/my-note-details-page.service';

@Component({
  selector: 'jegyzi-my-note-details-page',
  standalone: true,
  templateUrl: './my-note-details-page.component.html',
  styleUrl: './my-note-details-page.component.scss',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyNoteDetailsPageService],
})
export class MyNoteDetailsPageComponent {
  private userService = inject(UserService);
  private pageService = inject(MyNoteDetailsPageService);
  private commentService = inject(CommentService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  myNote = this.pageService.note;
  loggedInUser = this.userService.user;

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
      const myNote = this.myNote();

      untracked(() => {
        this.noteForm.setValue(myNote.note);
      });
    });
  }

  newComment(comment?: Comment) {
    if (comment != undefined) {
      this.commentService.createComment(comment, this.myNote()).then(() => {
        this.pageService.reload();
      });
    } else {
      this.pageService.reload();
    }
  }

  deleteNote() {
    this.dialog
      .open(DeleteConfirmModalComponent, { minWidth: '40vw', data: this.myNote() })
      .afterClosed()
      .subscribe((deleted) => {
        if (deleted) {
          this.router.navigate(['/my-notes']);
        }
      });
  }
}
