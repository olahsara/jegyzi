import { Component } from '@angular/core';
import { HeaderComponent } from "../../../shared/layout/header/header.component";
import { RouterLink } from "@angular/router";
import { TitleComponent } from '../../../shared/components/title/title.component';
import { MatTooltip } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { EducationPipe } from '../../../shared/pipes/education.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jegyzi-home-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TitleComponent,
    MatTooltip,
    RouterLink,
    NoValuePipe,
    AvatarComponent,
    NamePipe,
    EducationPipe
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  user = toSignal(this.authService.loggedInUser())
  profiles$ = this.userService.getTopUsers();

  constructor(private authService: AuthService, private userService: UserService) {
  }

  logout() {
    this.authService.logout()
  }
  
}
