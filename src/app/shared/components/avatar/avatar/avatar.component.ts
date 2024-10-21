import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, model, output } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
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
  private route = inject(Router);

  profileId = input.required<string>();
  profilPicEnabled = input.required<boolean>();
  size = input<string>('md');
  editable = input<boolean>(false);
  loading = model(false);
  link = input<string>();

  profilePic = computed(() => {
    return this.profilPicEnabled() ? this.userService.getProfilPic(this.profileId()) : null;
  });

  upload = output<ImageUploadEvent>();
  deleteProfilPic = output<void>();

  async onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    if (file) {
      this.upload.emit({ file: file[0] });
    }
  }

  navigate() {
    if (this.link()) {
      this.route.navigate([this.link()]);
    }
  }
}
