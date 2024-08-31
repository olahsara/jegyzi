import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileTypes, User } from '../models/user.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { EducationType } from '../models/eductaion.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { MyProfilePageComponent } from '../../profile/pages/my-profile-page/my-profile-page.component';

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
    MatSelectModule
  ],
  templateUrl: './register-modal-page.component.html',
  styleUrl: './register-modal-page.component.scss',
})
export class RegisterModalPageComponent{
  readonly dialogRef = inject(MatDialogRef<RegisterModalPageComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  steps = [0,1,2];
  actualStep = 0;

  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  form = new FormGroup({
    email: new FormControl<string | null>(null,{validators: [Validators.email, Validators.required]}),
    password: new FormControl<string | null>(null,{validators:[ Validators.required, Validators.minLength(6)]}),
    passwordConfirm: new FormControl<string | null>(null,{validators: Validators.required}),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    profileType: new FormControl<string | null>(null),
    education: new FormGroup({
      institution: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null),
      year: new FormControl<number | null>(null),
      specialization: new FormControl<string | null>(null)
    }),
    introduction: new FormControl<string | null>(null),
  });

  close() {
    this.dialogRef.close(undefined);
  }

  next(){
    this.actualStep++;
    if(this.steps.length === this.actualStep){
      if(this.form.valid) {
        this.register();
      } else {
        this.actualStep=0;
      }
      
    }
  }
  prew(){
    if(this.actualStep === 0) {
      this.close();
    }
    this.actualStep--;
  }

  register() {
    this.authService.signup(this.form.controls.email.value as string, this.form.controls.password.value as string).then((cred) => {
      this.authService.createProfile(cred.user);

      this.dialogRef.close(cred.user)
    }).catch(error => {
      this.toastService.error('Váratlan hiba a regisztráció során!')
    })
  }
 }