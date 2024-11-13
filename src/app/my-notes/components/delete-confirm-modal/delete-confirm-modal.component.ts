import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { Note } from '../../../shared/models/note.model';
import { Notification, NotificationType } from '../../../shared/models/notification.model';
import { CommentService } from '../../../shared/services/comment.service';
import { ModifyRequestService } from '../../../shared/services/modify-request.service';
import { NoteService } from '../../../shared/services/note.service';
import { NotificationService } from '../../../shared/services/notifictaion.service';
import { ReviewService } from '../../../shared/services/review.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { ModifyRequestStatusBadgeComponent } from '../modify-request-status-badge/modify-request-status-badge.component';

export interface DeleteConfirmModalData {
  note: Note;
}

@Component({
  selector: 'jegyzi-delete-confirm-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    FORM_DIRECTIVES,
    AvatarComponent,
    toDatePipe,
    ModifyRequestStatusBadgeComponent,
    MatCheckboxModule,
  ],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.scss',
})
export class DeleteConfirmModalComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteConfirmModalComponent>);
  readonly data = inject<DeleteConfirmModalData>(MAT_DIALOG_DATA);

  private requestService = inject(ModifyRequestService);
  private noteService = inject(NoteService);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private commentService = inject(CommentService);
  private reviewService = inject(ReviewService);

  close(deleted: boolean) {
    this.dialogRef.close(deleted);
  }

  submit() {
    //Jegyzet törlése:
    //Követőknél törlés
    this.data.note.followers.map((userId) => {
      this.userService.deleteNote(this.data.note, userId);
      const noti: Notification = {
        id: '',
        user: userId,
        date: Timestamp.fromDate(new Date()),
        new: true,
        title: 'Törölt jegyzet',
        type: NotificationType.OTHER,
        description:
          'Az általad követett note.title' + this.data.note.title + ' című jegyzetet a szerzője sajnos eltávolította a rendszerből.',
      };
      this.notificationService.createNotification(noti);
    });
    //Módosítási kérések törlése
    this.data.note.updateRequests.map((requestId) => {
      this.requestService.deleteModifyRequestById(requestId);
    });
    //Kommentel törlése
    this.data.note.comments.map((id) => {
      this.commentService.deleteComment(id);
    });
    //Értékelés törlése
    this.data.note.reviews.map((id) => {
      this.reviewService.deleteReview(id);
    });

    this.userService.reduceNoteNumber(this.data.note.creatorId);
    this.noteService.deleteNote(this.data.note);
    this.close(true);
  }
}
