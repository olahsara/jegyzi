import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../../login/model/user.model';

@Component({
  selector: 'jegyzi-avatar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() profile?: User;
 }
