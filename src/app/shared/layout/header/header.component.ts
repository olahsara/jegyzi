import { Component} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { SwitchButtonComponent } from "../../components/switch-button/switch-button.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  user = toSignal(this.authService.loggedInUser())

  constructor (private authService: AuthService, private router: Router) { }   

  logout() {
    this.authService.logout();
    this.router.navigate(['/'])

  }
}