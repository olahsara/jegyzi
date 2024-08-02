import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { User } from '../../../shared/models/user.model';
import { EducationPipe } from '../../../shared/pipes/education.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModifyModalPageComponent } from '../profile-modify-modal-page/profile-modify-modal-page.component';
import { ToastService } from '../../../shared/services/toast.service';

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
    AvatarComponent,
    NamePipe,
    MatTooltipModule,
    NoValuePipe,
    EducationPipe,
  ],
})
export class MyProfilePageComponent implements OnInit {
  profile = this.userService.user;
  following: User[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.profile()?.followers.forEach((element) => {
      this.userService.getUserById(element).then((el) => {
        el.forEach((user) => {
          this.following.push(user);
        });
      });
    });
  }

  modify() {
    const dialogRef = this.dialog.open(ProfileModifyModalPageComponent, {
      data: this.profile(),
      minWidth: '40vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.modifyUser(result);
      }
    });
  }
}
