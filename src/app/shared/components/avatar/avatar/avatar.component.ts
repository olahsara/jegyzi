import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { catchError, of } from 'rxjs';
import { UserService } from '../../../services/user.service';

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
  size = input<string>('md');
  editable = input<boolean>(false);
  loading = signal(false);
  link = input<string>();

  profilePic = signal<string | number | undefined>(undefined);

  readonly NoProfilePic = 'NO_PROFILE_PIC';

  constructor() {
    explicitEffect([this.profileId], ([profileId]) => {
      this.userService
        .getProfilPic(profileId!)
        .pipe(catchError(() => of(null)))
        .subscribe((value) => {
          this.profilePic.set(value ? value : this.NoProfilePic);
        });
    });
  }

  async onFileSelected(event: Event) {
    this.loading.set(true);
    const file = (event.target as HTMLInputElement).files;
    if (file) {
      this.userService.uploadProfilPic(file[0], this.profileId()!).then(() => {
        this.userService.getProfilPic(this.profileId()!).subscribe((value) => {
          this.profilePic.set(value ? value : this.NoProfilePic);
          this.loading.set(false);
        });
      });
    }
  }

  navigate() {
    if (this.link()) {
      this.route.navigate([this.link()]);
    }
  }

  deletePic() {
    this.userService.deleteProfilPic(this.profileId()!).then(() => {
      this.profilePic.set(this.NoProfilePic);
    });
  }
}
