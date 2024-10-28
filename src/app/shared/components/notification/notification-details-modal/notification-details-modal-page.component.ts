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

  notification = signal(this.notificationService.getNotificationById(this.data.notiId));
  type = NotificationType;

  close() {
    const data: Notification[] = [];
    this.notificationService.getLatestNotifications(this.data.userId).then((value) => {
      data.push(...value);
    });
    this.dialogRef.close(data);
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.close();
  }

  setStatus(status: boolean, id: string) {
    this.notificationService.setNotificationStatus(id, !status)?.then(() => {
      this.notification.set(this.notificationService.getNotificationById(this.data.notiId));
    });
  }

  deleteNotification(id: string) {
    this.notificationService.deleteNotification(id)?.then(() => {
      this.close();
    });
  }
}
