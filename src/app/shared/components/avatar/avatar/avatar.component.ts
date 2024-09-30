import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../../../models/user.model';
import { NamePipe } from '../../../pipes/name.pipe';
import { UserService } from '../../../services/user.service';

export interface ImageUploadEvent {
  file: File;
}

@Component({
  selector: 'jegyzi-avatar',
  standalone: true,
  imports: [CommonModule, NamePipe, MatTooltipModule, NgOptimizedImage, MatProgressSpinner],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  private userService = inject(UserService);

  profile = input.required<User>();
  size = input<string>('md');
  editable = input<boolean>(false);
  loading = model(false);

  profilePic = computed(() => {
    return this.userService.getProfilPic(this.profile().id);
  });

  upload = output<ImageUploadEvent>();
  deleteProfilPic = output<void>();

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    if (file) {
      this.upload.emit({ file: file[0] });
    }
  }
}
