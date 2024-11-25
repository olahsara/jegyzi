import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleComponent } from '../../../shared/components/title/title.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

@Component({
  selector: 'jegyzi-authentication-managment-page',
  standalone: true,
  imports: [CommonModule, FORM_DIRECTIVES, MatProgressSpinner, TitleComponent],
  templateUrl: './authentication-managment-page.component.html',
  styleUrl: './authentication-managment-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationManagmentPageComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  actionCodeChecked = signal(false);
  actionCode = signal<string | undefined>(undefined);

  passwordResetForm = new FormGroup({
    email: new FormControl<string>('', [Validators.email, Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (!params) this.router.navigate(['/home']);

      const mode = params['mode'];
      this.actionCode.set(params['oobCode']);

      if (params['mode'] === 'resetPassword') {
        this.authService
          .verifyPasswordCode(this.actionCode()!)
          .then((email) => {
            this.actionCodeChecked.set(true);
            this.passwordResetForm.controls.email.setValue(email);
          })
          .catch((e) => {
            this.toastService.error('Hiba lépett fel az azonosítás során, próbáld újra!');
            this.router.navigate(['/login']);
          });
      } else {
        this.toastService.error('Hiba lépett fel az azonosítás során, próbáld újra!');
        this.router.navigate(['/login']);
      }
    });
  }

  submit() {
    if (this.passwordResetForm.controls.password.value != this.passwordResetForm.controls.passwordConfirm.value) {
      this.toastService.error('A jelszavak nem egyeznek meg!');
      this.router.navigate(['/login']);
      return;
    } else {
      this.authService
        .confirmPasswordReset(this.actionCode()!, this.passwordResetForm.controls.password.value!)

        .then((resp) => {
          this.toastService.success('Az új jelszó elmentésre került!');
          this.router.navigate(['/login']);
        })
        .catch((e) => {
          this.toastService.error('Hiba a jelszó elmentése során. Próbálja másik jelszóval!');
        });
    }
  }
}
