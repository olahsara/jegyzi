import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
export class RegisterPageComponent {
  registerForm = new FormGroup({
    email: new FormControl<string>('',{validators: [Validators.email, Validators.required]}),
    password: new FormControl<string>('',{validators: Validators.required}),
    passwordConfirm: new FormControl<string>('',{validators: Validators.required})
  });

  constructor(private authService: AuthService, private router: Router, ){}

  register() {
    if(this.registerForm.controls.password.value === this.registerForm.controls.passwordConfirm.value){
      this.authService.signup(this.registerForm.controls.email.value as string, this.registerForm.controls.password.value as string).then((cred) => {
        this.authService.createProfile(cred.user);

        this.router.navigate(['/login']);
      }).catch(error => {
        console.error(error);
      })
    } else {
      //Todo: figyelmeztetés az oldalon
      console.log("hiba")
    }
  }
}
