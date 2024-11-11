import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EducationType } from '../../../shared/models/eductaion.model';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

@Component({
  selector: 'jegyzi-profile-modify-modal-page',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FORM_DIRECTIVES, NgxSkeletonLoaderModule],
  templateUrl: './profile-modify-modal-page.component.html',
  styleUrl: './profile-modify-modal-page.component.scss',
})
export class ProfileModifyModalPageComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProfileModifyModalPageComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);

  steps = [0, 1];
  actualStep = 0;

  error?: string;
  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  form = new FormGroup({
    email: new FormControl<string | null>(null, {
      validators: Validators.email,
    }),
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

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  next() {
    this.actualStep++;
    if (this.steps.length === this.actualStep) {
      this.modify();
    }
  }
  prew() {
    if (this.actualStep === 0) {
      this.close();
    }
    this.actualStep--;
  }

  modify() {
    if (this.form.valid) {
      if (this.form.value.profileType !== this.data.profileType) {
        this.remowePorpertiesAccordingType();
      }
      this.actualStep = 0;
      this.dialogRef.close(this.form.getRawValue());
    } else {
      this.error = 'Email cím formátuma nem megfelelő!';
    }
  }

  remowePorpertiesAccordingType() {
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
