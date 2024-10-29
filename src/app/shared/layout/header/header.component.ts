import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { NotificationDetailsModalPageComponent } from '../../components/notification/notification-details-modal/notification-details-modal-page.component';
import { NotificationListModalPageComponent } from '../../components/notification/notification-list-modal/notification-list-modal-page.component';
import { SwitchButtonComponent } from '../../components/switch-button/switch-button.component';
import { Notification } from '../../models/notification.model';
import { RegisterModalPageComponent } from '../../register-modal-page/register-modal-page.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notifictaion.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'jegyzi-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SwitchButtonComponent, MatTooltipModule, MatMenuModule, toDatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private dialog = inject(MatDialog);
  private themeService = inject(ThemeService);
  private notiService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLight = this.themeService.isLigth;

  imgUrl = computed(() => {
    return this.isLight() ? './assets/logo/logo_brown.svg' : './assets/logo/logo_purple.png';
  });

  user = toSignal(this.authService.loggedInUser());
  notifications = signal<Notification[]>([]);

  constructor() {
    effect(() => {
      const profile = this.user();
      untracked(() => {
        const data: Notification[] = [];
        if (profile) {
          this.notiService.getLatestNotifications(profile.uid).then((value) => {
            data.push(...value);
          });
          this.notifications.set(data);
        }
      });
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  register() {
    this.router.navigate(['/login']);
    this.dialog.open(RegisterModalPageComponent, {
      minWidth: '50vw',
    });
  }

  notificationDetails(id: string) {
    this.dialog
      .open(NotificationDetailsModalPageComponent, { data: { userId: this.user()?.uid, notiId: id }, minWidth: '40vw' })
      .afterClosed()
      .subscribe((data) => {
        this.notifications.set(data);
      });
  }
  allNotification() {
    this.dialog
      .open(NotificationListModalPageComponent, { data: { userId: this.user()?.uid }, minWidth: '40vw' })
      .afterClosed()
      .subscribe((data) => {
        this.notifications.set(data);
      });
  }
}
