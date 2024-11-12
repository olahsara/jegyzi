import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent, ImageUploadEvent } from '../../../shared/components/avatar/avatar/avatar.component';
import { ProfileListComponent } from '../../../shared/components/profile-list/profile-list.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { NoValuePipe } from '../../../shared/pipes/no-value.pipe';
import { TypePipe } from '../../../shared/pipes/type.pipe';
import { CommentService } from '../../../shared/services/comment.service';
import { NoteService } from '../../../shared/services/note.service';
import { ReviewService } from '../../../shared/services/review.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { MyProfilePageService } from '../../services/my-profile-page.service';
import { ProfileModifyModalComponent } from '../profile-modify-modal/profile-modify-modal.component';

@Component({
  selector: 'jegyzi-my-profile-page',
  standalone: true,
  templateUrl: './my-profile-page.component.html',
  styleUrl: './my-profile-page.component.scss',
  imports: [
    CommonModule,
    TitleComponent,
    FORM_DIRECTIVES,
    RouterLink,
    AvatarComponent,
    MatTooltipModule,
    NoValuePipe,
    TypePipe,
    ProfileListComponent,
  ],
  providers: [MyProfilePageService],
})
export class MyProfilePageComponent {
  private pageService = inject(MyProfilePageService);
  private userService = inject(UserService);
  private noteService = inject(NoteService);
  private commentService = inject(CommentService);
  private reviewService = inject(ReviewService);

  readonly dialog = inject(MatDialog);
  readonly profileTypes = ProfileTypes;

  profile = this.pageService.profile;
  following = computed(() => {
    const array: User[] = [];
    this.profile()?.follow.forEach((element) => {
      this.userService.getUserById(element).then((el) => {
        array.push(el[0]);
      });
    });
    return array;
  });

  uploadProfilPic(event: ImageUploadEvent) {
    this.userService.uploadProfilPic(event.file, this.profile()!.id).then(() => {
      this.userService.getUserById(this.profile()!.id).then((value) => {
        this.pageService.reload(value[0]);
      });
    });
  }

  deleteProfilPic() {
    this.userService.deleteProfilPic(this.profile()!.id).then(() => {
      this.userService.getUserById(this.profile()!.id).then((value) => {
        this.pageService.reload(value[0]);
      });
    });
  }

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
}
