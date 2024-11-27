import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Notification, NotificationType } from '../../../shared/models/notification.model';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { CommentService } from '../../../shared/services/comment.service';
import { ModifyRequestService } from '../../../shared/services/modify-request.service';
import { NoteService } from '../../../shared/services/note.service';
import { NotificationService } from '../../../shared/services/notifictaion.service';
import { ReviewService } from '../../../shared/services/review.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

export interface DeleteConfirmModalData {
  profile: User;
}

@Component({
  selector: 'jegyzi-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule, FORM_DIRECTIVES],
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
  private authService = inject(AuthService);

  /**
   * Modál ablak bezárása
   * @param deleted törlésere sor kerül-e
   */
  close(deleted: boolean) {
    this.dialogRef.close(deleted);
  }

  /**
   * Felhasználó törlése, és minden hozzá tartozó adat törlése:
   * Komment, értékelés, jegyzet, módosítási kérés: csere Törölt felhasználóra
   * Értesítések törlése
   */
  submit() {
    //Követőknél törlés
    this.data.profile.followers.map((userId) => {
      this.userService.deleteProfileFromFollowers(this.data.profile, userId);
      const noti: Notification = {
        id: '',
        user: userId,
        date: Timestamp.fromDate(new Date()),
        new: true,
        title: 'Törölt felhasználó',
        type: NotificationType.OTHER,
        description: 'Egy általad követett felhasználó törölte magát a rendszerből.',
      };
      this.notificationService.createNotification(noti);
    });

    //Módosítási kérések törlése
    this.requestService.deleteModifyRequestByUserId(this.data.profile.id);
    //Kommentel törlése
    this.commentService.updateCommentCreator(this.data.profile.id);
    //Értékelés törlése
    this.reviewService.updateReviewCreator(this.data.profile.id);

    this.noteService.updateCreator(this.data.profile.id);
    this.userService.deleteMyProfile(this.data.profile.id).then(() => this.authService.deleteAuth());

    this.close(true);
  }
}
