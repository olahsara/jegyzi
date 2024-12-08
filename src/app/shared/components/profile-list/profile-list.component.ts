import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { User } from '../../models/user.model';
import { NoValuePipe } from '../../pipes/no-value.pipe';
import { TypePipe } from '../../pipes/type.pipe';
import { UserService } from '../../services/user.service';
import { AvatarComponent } from '../avatar/avatar/avatar.component';

@Component({
  selector: 'jegyzi-profile-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RouterLink, NoValuePipe, TypePipe, MatTooltip],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
})
export class ProfileListComponent {
  private userService = inject(UserService);

  /** Felhasználók */
  profiles = input.required<User[]>();

  /** Bejelentkezett felhasználó */
  loggedInUser = this.userService.user;

  /** Kártyák megjelenítése egymás mellett (2db, után új sorban) */
  row = input(false);

  constructor() {
    explicitEffect([this.profiles], ([profiles]) => {
      console.log(profiles);
    });
  }
}
