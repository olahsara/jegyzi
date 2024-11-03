import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { User } from '../../models/user.model';
import { NamePipe } from '../../pipes/name.pipe';
import { NoValuePipe } from '../../pipes/no-value.pipe';
import { TypePipe } from '../../pipes/type.pipe';
import { UserService } from '../../services/user.service';
import { AvatarComponent } from '../avatar/avatar/avatar.component';
import { RatingComponent } from '../rating-component/rating.component';

@Component({
  selector: 'jegyzi-profile-list',
  standalone: true,
  imports: [CommonModule, RatingComponent, toDatePipe, AvatarComponent, RouterLink, NoValuePipe, NamePipe, TypePipe],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
})
export class ProfileListComponent {
  private userService = inject(UserService);

  profiles = input.required<User[]>();
  loggedInUser = this.userService.user;
}
