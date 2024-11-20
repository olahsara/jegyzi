import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { NoteCommentComponent } from '../../../note/components/note-comment/note-comment.component';
import { NoteReviewComponent } from '../../../note/components/note-review/note-review.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { Comment } from '../../../shared/models/comment.model';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { CommentService } from '../../../shared/services/comment.service';
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
    TitleComponent,
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

  /** A komponens szolgáltatásától lekért jegyzet */
  myNote = this.pageService.note;
  /** Bejelentkezett felhasználó */
  loggedInUser = this.userService.user;
  /** A jegyzet betöltéséhez szükséges control */
  noteForm = new FormControl<string | null>(null);

  /** Jegyzet beállítása az aktuális és frissült adatok alapján */
  constructor() {
    explicitEffect([this.myNote], ([myNote]) => {
      this.noteForm.setValue(myNote.note);
    });
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
}
