import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { EducationType } from '../../../shared/models/eductaion.model';
import { ProfileTypes } from '../../../shared/models/user.model';
import { NamePipe } from '../../../shared/pipes/name.pipe';
import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { TypePipe } from '../../../shared/pipes/type.pipe';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'jegyzi-profile-list-page',
  standalone: true,
  templateUrl: './profile-list-page.component.html',
  styleUrl: './profile-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TitleComponent,
    AvatarComponent,
    NamePipe,
    NoValuePipe,
    RouterLink,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    TypePipe,
  ],
})
export class ProfileListPageComponent {
  profiles$ = this.userService.getAllUsers();
  loggedInUser = this.userService.user;

  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    numberOfNotes: new FormControl<number | null>(null),
    numberOfFollowers: new FormControl<number | null>(null),
    profileType: new FormControl<string | null>(null),
    educationYear: new FormControl<number | null>(null),
    educationType: new FormControl<string | null>(null),
  });

  constructor(private userService: UserService) {}

  filter() {
    //TODO: filter
  }
}
