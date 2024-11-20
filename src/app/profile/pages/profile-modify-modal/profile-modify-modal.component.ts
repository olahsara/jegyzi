import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EducationType } from '../../../shared/models/eductaion.model';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

@Component({
  selector: 'jegyzi-profile-modify-modal',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FORM_DIRECTIVES, NgxSkeletonLoaderModule],
  templateUrl: './profile-modify-modal.component.html',
  styleUrl: './profile-modify-modal.component.scss',
})
export class ProfileModifyModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProfileModifyModalComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);

  steps = [0, 1];
  actualStep = 0;

  error?: string;
  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  /** Módosításhoz szükséges űrlap */
  form = new FormGroup({
    name: new FormControl<string | null>(null),
    profileType: new FormControl<string | null>(null),
    education: new FormGroup({
      institution: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null),
      year: new FormControl<number | null>(null),
      specialization: new FormControl<string | null>(null),
    }),
    other: new FormGroup({
      description: new FormControl<string | null>(null),
    }),
    work: new FormGroup({
      workPlace: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null),
      year: new FormControl<number | null>(null),
      position: new FormControl<string | null>(null),
    }),
    introduction: new FormControl<string | null>(null),
  });

  /** Beállítjuk az űrlapot a felhasználó jelenlegi adataival  */
  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  /** Modál ablak bezárása */
  close() {
    this.dialogRef.close(false);
  }

  /** Következő lépésre lépés */
  next() {
    this.actualStep++;
    if (this.steps.length === this.actualStep) {
      this.modify();
    }
  }

  /** Előző lépésre lépés */
  prew() {
    if (this.actualStep === 0) {
      this.close();
    }
    this.actualStep--;
  }

  /** Profil módosítását előkészítő függvény */
  modify() {
    if (this.form.valid) {
      if (this.form.value.profileType !== this.data.profileType) {
        this.removePorpertiesAccordingType();
      }
      this.actualStep = 0;
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  /** Profil típusa alapján törli a már nem releváns egyéb adatokat */
  removePorpertiesAccordingType() {
    switch (this.form.value.profileType) {
      case null:
        this.form.controls.education.reset();
        this.form.controls.work.reset();
        this.form.controls.other.reset();
        break;
      case ProfileTypes.student:
        this.form.controls.work.reset();
        this.form.controls.other.reset();
        break;
      case ProfileTypes.work:
        this.form.controls.education.reset();
        this.form.controls.other.reset();
        break;
      case ProfileTypes.other:
        this.form.controls.education.reset();
        this.form.controls.work.reset();
        break;
    }
  }
}
