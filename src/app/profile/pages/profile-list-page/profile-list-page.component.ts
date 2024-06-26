import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'jegyzi-profile-list-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './profile-list-page.component.html',
  styleUrl: './profile-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileListPageComponent { }
