import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { ProfileListComponent } from '../../../shared/components/profile-list/profile-list.component';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { ToastService } from '../../../shared/services/toast.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { DeleteConfirmModalComponent } from '../../components/delete-confirm-modal/delete-confirm-modal.component';
import { MyProfilePageService } from '../../services/my-profile-page.service';
import { ProfileModifyModalComponent } from '../profile-modify-modal/profile-modify-modal.component';

@Component({
  selector: 'jegyzi-my-profile-page',
  standalone: true,
  templateUrl: './my-profile-page.component.html',
  styleUrl: './my-profile-page.component.scss',
  imports: [CommonModule, FORM_DIRECTIVES, AvatarComponent, MatTooltipModule, NoValuePipe, ProfileListComponent],
  providers: [MyProfilePageService],
})
export class MyProfilePageComponent {
  private pageService = inject(MyProfilePageService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  private dialog = inject(MatDialog);
  private router = inject(Router);
  readonly profileTypes = ProfileTypes;

  /** A profil lekérése a komponens szolgáltatásától */
  profile = this.pageService.profile;

  /** Követések lista lekérése */
  following = computed(() => {
    const array: User[] = [];
    this.profile()?.follow.forEach((element) => {
      this.userService.getUserById(element).then((el) => {
        array.push(el);
      });
    });
    return array;
  });

  /** Módosítás modál megnyitása, majd bezárás és sikeres módosítás esetén a módosítás elvégzése és a profil frissítése */
  modify() {
    const dialogRef = this.dialog.open(ProfileModifyModalComponent, {
      data: this.profile(),
      minWidth: '40vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.modifyUser(result).then(() => {
          this.pageService.reload(result);
        });
      }
    });
  }
  deleteProfile() {
    this.dialog
      .open(DeleteConfirmModalComponent, { minWidth: '40vw', data: { profile: this.profile() } })
      .afterClosed()
      .subscribe((deleted) => {
        if (deleted) {
          this.toastService.success('A felhasználói fiók kitörlése sikeresen megtörtént!');
          this.router.navigate(['/home']);
        }
      });
  }
}
