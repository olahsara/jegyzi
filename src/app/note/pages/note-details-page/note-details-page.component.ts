import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';
import { ChatSession } from '@google/generative-ai';
import { MarkdownComponent } from 'ngx-markdown';
import { QuillEditorComponent } from 'ngx-quill';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { explicitEffect } from 'ngxtension/explicit-effect';
import Quill from 'quill';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { Comment } from '../../../shared/models/comment.model';
import { Review } from '../../../shared/models/review.model';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { CommentService } from '../../../shared/services/comment.service';
import { ReviewService } from '../../../shared/services/review.service';
import { ExampleResult, TextGenerateService } from '../../../shared/services/text-generate.service';
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
    FORM_DIRECTIVES,
    AvatarComponent,
    toDatePipe,
    QuillEditorComponent,
    MatTooltip,
    MatExpansionModule,
    RatingComponent,
    NoteReviewComponent,
    NoteCommentComponent,
    NgxSkeletonLoaderModule,
    MarkdownComponent,
  ],
  templateUrl: './note-details-page.component.html',
  styleUrl: './note-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotePageService, TextGenerateService],
})
export class NoteDetailsPageComponent {
  private userService = inject(UserService);
  private pageService = inject(NotePageService);
  private reviewService = inject(ReviewService);
  private commentService = inject(CommentService);
  private textGenerateService = inject(TextGenerateService);
  private dialog = inject(MatDialog);

  /** Quill editor komponens */
  editor = viewChild.required(QuillEditorComponent);
  /** A komponens szolgáltatásától lekért jegyzet */
  note = this.pageService.note;
  /** Bejelentkezett felhasználó */
  loggedInUser = this.userService.user;
  /** A bejelentkezett felhasználó követi-e a jegyzetet */
  followedNote = signal(false);

  /** A jegyzet betöltéséhez szükséges control */
  noteForm = new FormControl<string | null>(null);

  /** A generált példafeladatok */
  currentExample = signal<ExampleResult | null>(null);
  /** A generált válaszok */
  currentAnswers = signal<string | null>(null);

  exampleGenerateInProgress = signal(false);
  answerGenerateInProgress = signal(false);

  /** Követés és jegyzet beállítása az aktuális és frissült adatok alapján */
  constructor() {
    explicitEffect([this.note, this.loggedInUser], ([note, loggedInUser]) => {
      this.noteForm.setValue(note.note);
      this.followedNote.set(loggedInUser ? (note.followers.find((e) => e === loggedInUser.id) ? true : false) : false);
    });
    this.noteForm.disable();
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

  /**
   * Példafeladat generálása
   */
  async generateExample(session?: ChatSession) {
    this.exampleGenerateInProgress.set(true);
    const quill = new Quill(this.editor().editorElem);

    let result: ExampleResult;

    if (this.currentExample() !== null) {
      this.currentExample.set(null);
      this.currentAnswers.set(null);
      result = await this.textGenerateService.exampleGenerator(quill.getText(), session);
    } else {
      result = await this.textGenerateService.exampleGenerator(quill.getText());
    }
    if (result) {
      this.currentExample.set(result);
      this.exampleGenerateInProgress.set(false);
    }
  }

  async generateAnswers() {
    this.answerGenerateInProgress.set(true);

    const result = await this.textGenerateService.answerGenerator(this.currentExample()!.session);
    if (result) {
      this.currentAnswers.set(result.resultText);
      this.answerGenerateInProgress.set(false);
    }
  }
}
