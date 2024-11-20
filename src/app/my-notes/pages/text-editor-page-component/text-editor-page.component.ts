import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { LabelGroupComponent } from '../../../shared/components/label-group/label-group.component';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { LabelNote } from '../../../shared/models/label.model';
import { Note } from '../../../shared/models/note.model';
import { LabelService } from '../../../shared/services/label.service';
import { NoteService } from '../../../shared/services/note.service';
import { ToastService } from '../../../shared/services/toast.service';
import { UserService } from '../../../shared/services/user.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

@Component({
  selector: 'jegyzi-text-editor-page',
  standalone: true,
  templateUrl: './text-editor-page.component.html',
  styleUrl: './text-editor-page.component.scss',
  imports: [CommonModule, TitleComponent, FORM_DIRECTIVES, RouterLink, QuillEditorComponent, MatTooltip, LabelGroupComponent],
})
export class TextEditorPageComponent implements OnInit {
  private userService = inject(UserService);
  private labelService = inject(LabelService);
  private noteService = inject(NoteService);
  private destroyRef = inject(DestroyRef);
  private profile = this.userService.user;
  private toastService = inject(ToastService);
  private router = inject(Router);

  /** Címkék */
  labels$ = this.labelService.getLabels();

  /** Hibák (űrlap) */
  errors = signal<string | undefined>(undefined);

  /** Jegyzet szerkesztése esetén a szerkeszteni kívánt jegyzet (resolverből) */
  myNote = input<Note>();

  /** Űrlap a jegyzet készítéshez / módosításhoz */
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null, Validators.required),
    subTitle: new FormControl<string | null>(null),
    note: new FormControl<string | null>(null, Validators.required),
    labels: new FormControl<LabelNote[]>([], Validators.required) as FormControl<LabelNote[]>,
    creatorId: new FormControl<string | null>(null),
    created: new FormControl<Timestamp | null>(null),
    followers: new FormControl<string[]>([]),
    followersNumber: new FormControl<number>(0),
    comments: new FormControl<string[]>([]),
    reviews: new FormControl<string[]>([]),
    updateRequests: new FormControl<string[]>([]),
    lastModify: new FormControl<Timestamp | null>(null),
    numberOfUpdateRequests: new FormControl<number>(0),
  });

  /** Szekesztés esetén az űrlap inicializálása az adatokkal */
  constructor() {
    explicitEffect([this.myNote], ([myNote]) => {
      if (myNote) {
        this.form.patchValue(myNote);
      }
    });
  }

  /** TODO: TÖRÖLNI -> csak ellenőrzés */
  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      console.log(value);
    });
  }

  /** Jegyzet létrehozása / módosítása */
  submit() {
    if (this.form.value.title && this.form.value.note) {
      this.errors.set(undefined);
      if (this.myNote()) {
        this.form.controls.lastModify.setValue(Timestamp.fromDate(new Date()) as Timestamp);
        this.noteService.updateNote(this.form.value as Note);
      } else {
        this.form.controls.creatorId.setValue(this.profile()?.id!);
        this.form.controls.created.setValue(Timestamp.fromDate(new Date()) as Timestamp);

        this.noteService.createNote(this.form.value as Note, this.profile()!).finally(() => {
          this.toastService.success('Sikeres feltöltés!');
          this.userService.createNote(this.profile()!);
          this.router.navigate(['/my-notes']);
        });
      }
    } else {
      this.errors.set('Cím és tartalom megadása kötelező!');
    }
  }

  /** Szerkesztése elvetése és elnavigálás a megfelelő oldalra */
  cancel() {
    this.form.reset();
    if (this.myNote()) {
      this.router.navigate(['/my-notes/', this.myNote()?.id]);
    } else {
      this.router.navigate(['/my-notes']);
    }
  }
}
