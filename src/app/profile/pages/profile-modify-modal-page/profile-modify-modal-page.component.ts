import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EducationType } from '../../../shared/models/eductaion.model';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { MyProfilePageComponent } from '../my-profile-page/my-profile-page.component';

@Component({
  selector: 'jegyzi-profile-modify-modal-page',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './profile-modify-modal-page.component.html',
  styleUrl: './profile-modify-modal-page.component.scss',
})
export class ProfileModifyModalPageComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<MyProfilePageComponent>);
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
    lastName: new FormControl<string | null>(null),
    firstName: new FormControl<string | null>(null),
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
      this.form.setValue({
        email: this.data.email || null,
        lastName: this.data.lastName || null,
        firstName: this.data.firstName || null,
        profileType: this.data.profileType || null,
        education: {
          institution: this.data.education?.institution || null,
          specialization: this.data.education?.specialization || null,
          year: this.data.education?.year || null,
          type: this.data.education?.type || null,
        },
        other: {
          description: this.data.other?.description || null,
        },
        work: {
          workPlace: this.data.work?.workPlace || null,
          position: this.data.work?.position || null,
          year: this.data.work?.year || null,
          type: this.data.work?.type || null,
        },
        introduction: this.data.introduction || null,
      });
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
        this.form.controls.education.setValue({
          institution: null,
          specialization: null,
          year: null,
          type: null,
        });
        this.form.controls.work.setValue({
          workPlace: null,
          position: null,
          year: null,
          type: null,
        });
        this.form.controls.other.setValue({
          description: null,
        });
        break;
      case ProfileTypes.student:
        this.form.controls.work.setValue({
          workPlace: null,
          position: null,
          year: null,
          type: null,
        });
        this.form.controls.other.setValue({
          description: null,
        });
        break;
      case ProfileTypes.work:
        this.form.controls.education.setValue({
          institution: null,
          specialization: null,
          year: null,
          type: null,
        });
        this.form.controls.other.setValue({
          description: null,
        });
        break;
      case ProfileTypes.other:
        this.form.controls.education.setValue({
          institution: null,
          specialization: null,
          year: null,
          type: null,
        });
        this.form.controls.work.setValue({
          workPlace: null,
          position: null,
          year: null,
          type: null,
        });
        break;
    }
  }
}
