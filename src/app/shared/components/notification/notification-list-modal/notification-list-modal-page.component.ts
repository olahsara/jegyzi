import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { toDatePipe } from '../../../../note/pipes/to-date.pipe';
import { Notification } from '../../../models/notification.model';
import { NotificationService } from '../../../services/notifictaion.service';
import { PaginatorService } from '../../../services/paginator.service';
import { NotificationDetailsModalPageComponent } from '../notification-details-modal/notification-details-modal-page.component';

@Component({
  selector: 'jegyzi-notification-list-modal-page',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, toDatePipe, RouterLink, MatTableModule, MatPaginator],
  templateUrl: './notification-list-modal-page.component.html',
  styleUrl: './notification-list-modal-page.component.scss',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class NotificationListModalPageComponent {
  readonly dialogRef = inject(MatDialogRef<NotificationListModalPageComponent>);
  private dialog = inject(MatDialog);
  readonly data = inject<{ userId: string }>(MAT_DIALOG_DATA);
  private notificationService = inject(NotificationService);

  paginator = viewChild.required<MatPaginator>('paginator');

  displayedColumns = ['new', 'title', 'date', 'actions'];
  notifications = this.notificationService.getNotifications(this.data.userId);
  dataSource = signal<MatTableDataSource<Notification>>(new MatTableDataSource<Notification>());

  ngAfterViewInit() {
    this.notificationService.getNotifications(this.data.userId).then((value) => {
      this.dataSource.set(new MatTableDataSource<Notification>(value));
      this.dataSource().paginator = this.paginator();
    });
  }

  close() {
    const data: Notification[] = [];
    this.notificationService.getLatestNotifications(this.data.userId).then((value) => {
      data.push(...value);
      this.dialogRef.close(data);
    });
  }

  setStatus(status: boolean, id: string) {
    this.notificationService.setNotificationStatus(id, !status)?.then(() => {
      this.notificationService.getNotifications(this.data.userId).then((value) => {
        this.dataSource.set(new MatTableDataSource<Notification>(value));
        this.dataSource().paginator = this.paginator();
      });
    });
  }

  deleteNotification(id: string) {
    this.notificationService.deleteNotification(id)?.then(() => {
      this.notificationService.getNotifications(this.data.userId).then((value) => {
        this.dataSource.set(new MatTableDataSource<Notification>(value));
        this.dataSource().paginator = this.paginator();
      });
    });
  }

  toDetails(id: string) {
    this.dialog
      .open(NotificationDetailsModalPageComponent, { data: { userId: this.data.userId, notiId: id } })
      .afterClosed()
      .subscribe(() => {
        this.notificationService.getNotifications(this.data.userId).then((value) => {
          this.dataSource.set(new MatTableDataSource<Notification>(value));
          this.dataSource().paginator = this.paginator();
        });
      });
  }
}
