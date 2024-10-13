import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { UserService } from '../../../shared/services/user.service';
import { toDatePipe } from '../../pipes/to-date.pipe';
import { NotePageService } from '../../services/note-page.service';

@Component({
  selector: 'jegyzi-note-details-page',
  standalone: true,
  imports: [CommonModule, TitleComponent, ReactiveFormsModule, RouterLink, AvatarComponent, toDatePipe, QuillEditorComponent, MatTooltip],
  templateUrl: './note-details-page.component.html',
  styleUrl: './note-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NotePageService, MatTooltip],
})
export class NoteDetailsPageComponent {
  private userService = inject(UserService);
  private pageService = inject(NotePageService);

  note = this.pageService.note;
  loggedInUser = this.userService.user;
  followedNote = signal(false);

  noteForm = new FormControl<string | null>(null);

  filterForm = new FormGroup({
    name: new FormControl<string | null>(null),
    numberOfNotes: new FormControl<number | null>(null),
    numberOfFollowers: new FormControl<number | null>(null),
    profileType: new FormControl<string | null>(null),
    educationYear: new FormControl<number | null>(null),
    educationType: new FormControl<string | null>(null),
  });

  constructor() {
    effect(() => {
      const note = this.note();
      const loggedInUser = this.loggedInUser();

      untracked(() => {
        this.noteForm.setValue(note.note);
        this.followedNote.set(loggedInUser ? (loggedInUser.follow.find((e) => e === note.id) ? true : false) : false);
      });
    });
  }

  follow() {}

  unFollow() {}

  modifyRequest() {}
}
