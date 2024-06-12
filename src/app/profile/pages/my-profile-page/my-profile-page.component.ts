import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'jegyzi-my-profile-page',
  standalone: true,
  templateUrl: './my-profile-page.component.html',
  styleUrl: './my-profile-page.component.scss',
  imports: [
    CommonModule,
    TitleComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
  ],
})
export class MyProfilePageComponent {
  profiles?: User;
  @Input() profile?: User;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    console.log(this.profile);
    this.userService.getUserById(this.authService.getUid()!).then((value) => {
      value.forEach((e) => {
        if (e.data().name) {
        }
        this.profiles = e.data();
      });
    });
  }
}
