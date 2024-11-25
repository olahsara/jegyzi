import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

@Component({
  selector: 'jegyzi-forgotten-password-modal',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FORM_DIRECTIVES],
  templateUrl: './forgotten-password-modal.component.html',
  styleUrl: './forgotten-password-modal.component.scss',
})
export class ForgottenPasswordModalComponent {
  readonly dialogRef = inject(MatDialogRef<ForgottenPasswordModalComponent>);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  /** Új jelszó beállításához szükséges űrlap */
  form = new FormGroup({
    email: new FormControl<string | null>(null, { validators: [Validators.email, Validators.required] }),
  });

  /** Modál ablak bezárása */
  close() {
    this.dialogRef.close(undefined);
  }

  /** Új jelszó létehozásához szükséges email küldése */
  submit() {
    if (this.form.valid) {
      this.authService
        .resetPassword(this.form.controls.email.value as string)
        .then(() => {
          this.toastService.success('Az új jelszó beállításához szükséges emailt elküldtük Neked!');
          this.dialogRef.close();
        })
        .catch(() => {
          this.toastService.error('Váratlan hiba a kérés során!');
        });
    }
  }
}
