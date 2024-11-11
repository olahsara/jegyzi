import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
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

  profiles = input.required<User[]>();
  loggedInUser = this.userService.user;
}
