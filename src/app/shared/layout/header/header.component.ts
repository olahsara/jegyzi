import { Component, inject} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { SwitchButtonComponent } from "../../components/switch-button/switch-button.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { RegisterModalPageComponent } from '../../register-modal-page/register-modal-page.component';

@Component({
  selector: 'jegyzi-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SwitchButtonComponent,
    RouterOutlet,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);
  user = toSignal(this.authService.loggedInUser())

  constructor (private authService: AuthService, private router: Router) { }   

  logout() {
    this.authService.logout();
    this.router.navigate(['/'])
  }

  register() {
    this.router.navigate(['/login' ]);
    const dialogRef = this.dialog.open(RegisterModalPageComponent, {
      minWidth: '50vw',
    });
  }
}