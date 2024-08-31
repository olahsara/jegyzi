import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { UserService } from '../../../shared/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterModalPageComponent } from '../../../shared/register-modal-page/register-modal-page.component';

@Component({
  selector: 'jegyzi-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    TitleComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
  ],
})
export class LoginComponent {
  readonly dialog = inject(MatDialog);
  
  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('', { validators: Validators.required }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
  ) {}

  login() {
    this.authService
      .login(
        this.loginForm.controls.email.value as string,
        this.loginForm.controls.password.value as string
      )
      .then((cred) => {
        this.userService.getUserById(cred.user?.uid!).then((element) => {
          this.userService.user.set(element[0]);
        })
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error(error);
        this.toastService.error('Hiba a bejelentkezés során!');
      });
  }

  register() {
    const dialogRef = this.dialog.open(RegisterModalPageComponent, {
      minWidth: '50vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loginForm.controls.email.setValue(result.email)
      }
    });
  }
}
