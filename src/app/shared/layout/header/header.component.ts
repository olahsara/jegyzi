import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
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

  user = toSignal(this.authService.loggedInUser());
  isLight = this.themeService.isLigth;
  imgUrl = computed(() => {
    return this.isLight() ? './assets/logo/logo_brown.svg' : './assets/logo/logo_purple.png';
  });

  notifications = computed(() => {
    const data: Notification[] = [];
    if (this.user()) {
      this.notiService.getNotifications(this.user()!.uid!).then((value) => {
        console.log(value);
        data.push(...value);
      });
    }
    return data;
  });

  constructor(private authService: AuthService, private router: Router) {}

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
}
