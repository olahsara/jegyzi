import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { toDatePipe } from '../../../../note/pipes/to-date.pipe';
import { Notification, NotificationType } from '../../../models/notification.model';
import { NotificationService } from '../../../services/notifictaion.service';

@Component({
  selector: 'jegyzi-notification-details-modal-page',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, toDatePipe, RouterLink, MatProgressSpinner],
  templateUrl: './notification-details-modal-page.component.html',
  styleUrl: './notification-details-modal-page.component.scss',
})
export class NotificationDetailsModalPageComponent {
  readonly dialogRef = inject(MatDialogRef<NotificationDetailsModalPageComponent>);
  readonly data = inject<{ userId: string; notiId: string }>(MAT_DIALOG_DATA);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  /** Az értékelés */
  notification = signal(this.notificationService.getNotificationById(this.data.notiId));

  /** Értékelés lehetséges típusai */
  type = NotificationType;

  /** Modál ablak bezárása */
  close() {
    const data: Notification[] = [];
    this.notificationService.getLatestNotifications(this.data.userId).then((value) => {
      data.push(...value);
      this.dialogRef.close(data);
    });
  }

  /** Navigálás
   * @param path cél
   */
  navigate(path: string) {
    this.router.navigate([path]);
    this.close();
  }

  /**
   * Értékelés státuszának beállítása
   * @param status státusz
   * @param id értékelés id-ja
   */
  setStatus(status: boolean, id: string) {
    this.notificationService.setNotificationStatus(id, !status)?.then(() => {
      this.notification.set(this.notificationService.getNotificationById(this.data.notiId));
    });
  }

  /**
   * Értékelés törlése
   * @param id értékelés íd-ja
   */
  deleteNotification(id: string) {
    console.log(id, this.notification());
    this.notificationService.deleteNotification(id)?.then(() => {
      this.close();
    });
  }
}
