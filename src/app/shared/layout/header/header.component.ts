import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SwitchButtonComponent } from '../../components/switch-button/switch-button.component';
import { RegisterModalPageComponent } from '../../register-modal-page/register-modal-page.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'jegyzi-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SwitchButtonComponent, RouterOutlet, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private dialog = inject(MatDialog);
  user = toSignal(this.authService.loggedInUser());
  private themeService = inject(ThemeService);
  isLight = this.themeService.isLigth;
  imgUrl = computed(() => {
    return this.isLight() ? './assets/logo/logo_brown.svg' : './assets/logo/logo_purple.png';
  });

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  register() {
    this.router.navigate(['/login']);
    const dialogRef = this.dialog.open(RegisterModalPageComponent, {
      minWidth: '50vw',
    });
  }
}
