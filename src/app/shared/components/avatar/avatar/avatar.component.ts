import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, model, output, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { catchError, of } from 'rxjs';
import { UserService } from '../../../services/user.service';

export interface ImageUploadEvent {
  file: File;
}

@Component({
  selector: 'jegyzi-avatar',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, NgOptimizedImage, MatProgressSpinner],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  private userService = inject(UserService);
  private route = inject(Router);

  profileId = input<string>();
  profilPicEnabled = input<boolean>();
  size = input<string>('md');
  editable = input<boolean>(false);
  loading = model(false);
  link = input<string>();

  profilePic = signal<string | null | undefined>(undefined);

  upload = output<ImageUploadEvent>();
  deleteProfilPic = output<void>();

  constructor() {
    explicitEffect([this.profilPicEnabled, this.profileId], ([profilPicEnabled, profileId]) => {
      if (profilPicEnabled) {
        this.userService
          .getProfilPic(profileId!)
          .pipe(catchError(() => of(null)))
          .subscribe((value) => {
            this.profilePic.set(value);
          });
      } else {
        this.profilePic.set(null);
      }
    });
  }

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
