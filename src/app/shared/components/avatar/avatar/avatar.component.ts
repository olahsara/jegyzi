import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../../../models/user.model';
import { NamePipe } from '../../../pipes/name.pipe';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'jegyzi-avatar',
  standalone: true,
  imports: [CommonModule, NamePipe, MatTooltipModule, NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  profile = input.required<User>();
  size = input<string>('md');
  editable = input<boolean>(false);
  profilePic = computed(() => {
    return this.userService.getProfilPic(this.profile().id);
  });

  constructor(private userService: UserService) {}

  upload(event: Event) {
    const img = (event.target as HTMLInputElement).files;
    if (img) {
      this.userService.uploadProfilPic(img[0], this.profile().id);
    }
  }
}
