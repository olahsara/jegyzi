import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { EducationType } from '../../../shared/models/eductaion.model';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'jegyzi-register-page',
  standalone: true,
  imports: [CommonModule, TitleComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatInputModule, MatSelectModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  steps = [0, 1, 2];
  actualStep = 0;

  disabled = true;
  errorMessages: string[] = [];

  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  authForm = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.email, Validators.required]),
    password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl<string | null>(null, Validators.required),
    firstName: new FormControl<string | null>(null, Validators.required),
    lastName: new FormControl<string | null>(null, Validators.required),
  });

  registerForm = new FormGroup({
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
    //Nem megadható mezők
    id: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    firstName: new FormControl<string | null>(null),
    lastName: new FormControl<string | null>(null),
    follow: new FormControl<Array<string>>([]),
    followers: new FormControl<Array<string>>([]),
    followersNumber: new FormControl<number>(0),
    profilePicture: new FormControl(''),
  });

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  register() {
    if (this.authForm.valid) {
      this.authService
        .signup(this.authForm.value.email as string, this.authForm.value.password as string)
        .then((cred) => {
          this.registerForm.controls.id.setValue(cred.user?.uid!);
          this.registerForm.patchValue(this.authForm.getRawValue());
          this.authService.createProfile(this.registerForm.getRawValue() as User);
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.toastService.error('A megadott email címmel már regisztrátak az oldalra!');
              break;
            default:
              this.toastService.error('Váratlan hiba a regisztráció során!');
          }

          this.actualStep = 0;
        });
    } else {
      this.actualStep = 0;
    }
  }
  next() {
    this.actualStep++;
    if (this.steps.length === this.actualStep) {
      this.register();
    }
  }
  prew() {
    this.actualStep--;
  }
}
