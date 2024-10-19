import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { LabelGroupComponent } from '../../../shared/components/label-group/label-group.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { LabelNote } from '../../../shared/models/label.model';
import { Note } from '../../../shared/models/note.model';
import { LabelService } from '../../../shared/services/label.service';
import { NoteService } from '../../../shared/services/note.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'jegyzi-text-editor',
  standalone: true,
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
  imports: [
    CommonModule,
    TitleComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
    QuillEditorComponent,
    MatTooltip,
    LabelGroupComponent,
  ],
})
export class TextEditorComponent {
  private userService = inject(UserService);
  private labelService = inject(LabelService);
  private noteService = inject(NoteService);
  private destroyRef = inject(DestroyRef);
  private profile = this.userService.user;

  labels$ = this.labelService.getLabels();

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    subTitle: new FormControl<string | null>(null),
    note: new FormControl<string | null>(null, Validators.required),
    labels: new FormControl<LabelNote[]>([], Validators.required) as FormControl<LabelNote[]>,
    creatorId: new FormControl<string | null>(null),
    created: new FormControl<Timestamp>(Timestamp.fromDate(new Date()) as Timestamp),
    followers: new FormControl<string[]>([]),
    followersNumber: new FormControl<number>(0),
    comments: new FormControl<string[]>([]),
    reviews: new FormControl<string[]>([]),
    updateRequests: new FormControl<string[]>([]),
    lastModify: new FormControl<Timestamp>(Timestamp.fromDate(new Date()) as Timestamp),
    creatorProfilPic: new FormControl<boolean>(false),
  });

  // ngOnInit(): void {
  //   this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
  //     console.log(value);
  //   });
  // }

  submit() {
    this.form.controls.creatorId.setValue(this.profile()?.id!);
    this.form.controls.creatorProfilPic.setValue(this.profile()?.profilePicture ?? false);

    this.noteService.createNote(this.form.value as Note);
  }
}
