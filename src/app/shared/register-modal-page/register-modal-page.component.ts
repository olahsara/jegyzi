import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EducationType } from '../models/eductaion.model';
import { ProfileTypes, User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'jegyzi-profile-modify-modal-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './register-modal-page.component.html',
  styleUrl: './register-modal-page.component.scss',
})
export class RegisterModalPageComponent {
  readonly dialogRef = inject(MatDialogRef<RegisterModalPageComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  steps = [0, 1, 2];
  actualStep = 0;

  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  form = new FormGroup({
    email: new FormControl<string | null>(null, { validators: [Validators.email, Validators.required] }),
    password: new FormControl<string | null>(null, { validators: [Validators.required, Validators.minLength(6)] }),
    passwordConfirm: new FormControl<string | null>(null, { validators: Validators.required }),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
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

  close() {
    this.dialogRef.close(undefined);
  }

  next() {
    this.actualStep++;
    if (this.steps.length === this.actualStep) {
      if (this.form.valid) {
        this.register();
      } else {
        this.actualStep = 0;
      }
    }
  }
  prew() {
    if (this.actualStep === 0) {
      this.close();
    }
    this.actualStep--;
  }

  register() {
    this.authService
      .signup(this.form.controls.email.value as string, this.form.controls.password.value as string)
      .then((cred) => {
        if (cred.user) {
          this.authService.createProfile(this.form.value as User);
        }

        this.dialogRef.close(cred.user);
      })
      .catch((error) => {
        this.toastService.error('Váratlan hiba a regisztráció során!');
      });
  }
}
