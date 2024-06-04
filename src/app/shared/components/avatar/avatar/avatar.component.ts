import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../../models/user.model';
import { NamePipe } from '../../../pipes/name.pipe';

@Component({
  selector: 'jegyzi-avatar',
  standalone: true,
  imports: [
    CommonModule, NamePipe
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input({required: true}) profile!: User;
 }
