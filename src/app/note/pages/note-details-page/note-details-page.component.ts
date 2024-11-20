import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { Comment } from '../../../shared/models/comment.model';
import { Review } from '../../../shared/models/review.model';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { CommentService } from '../../../shared/services/comment.service';
import { ReviewService } from '../../../shared/services/review.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { NoteCommentComponent } from '../../components/note-comment/note-comment.component';
import {
  ModifyRequestModalData,
  NoteModifyRequestModalComponent,
} from '../../components/note-modify-request/note-modify-request.component';
import { NoteReviewComponent } from '../../components/note-review/note-review.component';
import { NotePageService } from '../../services/note-page.service';

@Component({
  selector: 'jegyzi-note-details-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    FORM_DIRECTIVES,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    QuillEditorComponent,
    MatTooltip,
    MatExpansionModule,
    RatingComponent,
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

  /** A komponens szolgáltatásától lekért jegyzet */
  note = this.pageService.note;
  /** Bejelentkezett felhasználó */
  loggedInUser = this.userService.user;
  /** A bejelentkezett felhasználó követi-e a jegyzetet */
  followedNote = signal(false);

  /** A jegyzet betöltéséhez szükséges control */
  noteForm = new FormControl<string | null>(null);

  /** Követés és jegyzet beállítása az aktuális és frissült adatok alapján */
  constructor() {
    explicitEffect([this.note, this.loggedInUser], ([note, loggedInUser]) => {
      this.noteForm.setValue(note.note);
      this.followedNote.set(loggedInUser ? (note.followers.find((e) => e === loggedInUser.id) ? true : false) : false);
    });
  }

  /** Jegyzet bekövetése */
  follow() {
    this.userService.followNote(this.note()).finally(() => {
      this.pageService.reload();
    });
  }

  /** Jegyzet kikövetése */
  unFollow() {
    this.userService.unFollowNote(this.note()).finally(() => {
      this.pageService.reload();
    });
  }

  /**
   * Új értékelése létrehozása és/vagy értékelések frissítése
   * @param review az értékelése
   */
  refreshReview(review?: Review) {
    if (review != undefined) {
      this.reviewService.createReview(review, this.note()).then((id) => {
        this.pageService.reload();
      });
    } else {
      this.pageService.reload();
    }
  }

  /**
   * Új komment létrehozása és/vagy kommentek frissítése
   * @param comment az értékelése
   */
  refreshComment(comment?: Comment) {
    if (comment != undefined) {
      this.commentService.createComment(comment, this.note()).then(() => {
        this.pageService.reload();
      });
    } else {
      this.pageService.reload();
    }
  }

  /**
   * Módosítási kérés modál megnyitása, és az új módosítási kérés feltöltése
   */
  modifyRequest() {
    this.dialog
      .open(NoteModifyRequestModalComponent, {
        minWidth: '50vw',
        maxHeight: '90vh',
        data: { note: this.note(), creator: this.loggedInUser() } as ModifyRequestModalData,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value) this.pageService.reload();
      });
  }
}
