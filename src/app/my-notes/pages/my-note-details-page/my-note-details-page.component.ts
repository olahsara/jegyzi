import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { ChatSession } from '@google/generative-ai';
import { MarkdownComponent } from 'ngx-markdown';
import { QuillEditorComponent } from 'ngx-quill';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { explicitEffect } from 'ngxtension/explicit-effect';
import Quill from 'quill';
import { NoteCommentComponent } from '../../../note/components/note-comment/note-comment.component';
import { NoteReviewComponent } from '../../../note/components/note-review/note-review.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { Comment } from '../../../shared/models/comment.model';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { CommentService } from '../../../shared/services/comment.service';
import { ExampleResult, TextGenerateService } from '../../../shared/services/text-generate.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';
import { MyNoteDetailsPageService } from '../../services/my-note-details-page.service';

@Component({
  selector: 'jegyzi-my-note-details-page',
  standalone: true,
  templateUrl: './my-note-details-page.component.html',
  styleUrl: './my-note-details-page.component.scss',
  imports: [
    CommonModule,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    QuillEditorComponent,
    MatTooltip,
    MatExpansionModule,
    RatingComponent,
    FORM_DIRECTIVES,
    NoteReviewComponent,
    NoteCommentComponent,
    MarkdownComponent,
    NgxSkeletonLoaderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MyNoteDetailsPageService, TextGenerateService],
})
export class MyNoteDetailsPageComponent {
  private userService = inject(UserService);
  private pageService = inject(MyNoteDetailsPageService);
  private commentService = inject(CommentService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private textGenerateService = inject(TextGenerateService);

  /** Quill editor komponens */
  editor = viewChild.required(QuillEditorComponent);
  /** A komponens szolgáltatásától lekért jegyzet */
  myNote = this.pageService.note;
  /** Bejelentkezett felhasználó */
  loggedInUser = this.userService.user;
  /** A jegyzet betöltéséhez szükséges control */
  noteForm = new FormControl<string | null>(null);

  /** A generált példafeladatok */
  currentExample = signal<ExampleResult | null>(null);
  /** A generált válaszok */
  currentAnswers = signal<string | null>(null);

  exampleGenerateInProgress = signal(false);
  answerGenerateInProgress = signal(false);

  /** Jegyzet beállítása az aktuális és frissült adatok alapján */
  constructor() {
    explicitEffect([this.myNote], ([myNote]) => {
      this.noteForm.setValue(myNote.note);
    });
    this.noteForm.disable();
  }

  /**
   * Új komment létrehozása és/vagy kommentek frissítése
   * @param comment az értékelése
   */
  refreshComment(comment?: Comment) {
    if (comment != undefined) {
      this.commentService.createComment(comment, this.myNote()).then(() => {
        this.pageService.reload();
      });
    } else {
      this.pageService.reload();
    }
  }

  /** Jegyzet törlését megerősítő modál megnyitása, majd Jegyzeteim listaoldalra navigálás megerősítés esetén */
  deleteNote() {
    this.dialog
      .open(DeleteConfirmModalComponent, { minWidth: '40vw', data: { note: this.myNote() } })
      .afterClosed()
      .subscribe((deleted) => {
        if (deleted) {
          this.router.navigate(['/my-notes']);
        }
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
