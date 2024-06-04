import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastService } from '../../../shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'jegyzi-register-page',
  standalone: true,
  imports: [
    CommonModule, 
    TitleComponent, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    MatInputModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit{
  disabled = true;
  errorMessages: string[] = [];

  registerForm = new FormGroup({
    email: new FormControl<string>('',{validators: [Validators.email, Validators.required]}),
    password: new FormControl<string>('',{validators: Validators.required}),
    passwordConfirm: new FormControl<string>('',{validators: Validators.required})
  });

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService, private destroyRef: DestroyRef){}
  ngOnInit(): void {
    this.registerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if(value.email) {
          if( value.passwordConfirm && value.password === value.passwordConfirm){
            this.disabled = false;
          } else {
            this.disabled = true
          }
        } else {
          this.disabled = true;
        }
      })
  }

  register() {
    this.authService.signup(this.registerForm.controls.email.value as string, this.registerForm.controls.password.value as string).then((cred) => {
      this.authService.createProfile(cred.user);

      this.router.navigate(['/login']);
    }).catch(error => {
      console.error(error);
      this.toastService.error('Váratlan hiba a regisztráció során!')
    })
  }
}
