import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Education, EducationType } from '../models/eductaion.model';
import { Other, ProfileTypes, User, Work } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { FORM_DIRECTIVES } from '../utils/form';

@Component({
  selector: 'jegyzi-register-modal-page',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FORM_DIRECTIVES, NgxSkeletonLoaderModule, MatProgressSpinnerModule, NgOptimizedImage],
  templateUrl: './register-modal-page.component.html',
  styleUrl: './register-modal-page.component.scss',
})
export class RegisterModalPageComponent {
  readonly dialogRef = inject(MatDialogRef<RegisterModalPageComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  profilPic = signal<File | null>(null);
  profilPicSrc = signal<string>('');
  loading = signal<boolean>(false);

  steps = [0, 1, 2];
  actualStep = 0;

  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  /** Regisztráláshoz szükséges űrlap */
  form = new FormGroup({
    email: new FormControl<string | null>(null, { validators: [Validators.email, Validators.required] }),
    password: new FormControl<string | null>(null, { validators: [Validators.required, Validators.minLength(6)] }),
    passwordConfirm: new FormControl<string | null>(null, { validators: Validators.required }),
    name: new FormControl<string | null>(null, Validators.required),
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

  /** Modál ablak bezárása */
  close() {
    this.dialogRef.close(undefined);
  }

  /** Következő lépés */
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

  /** Előző lépés */
  prew() {
    if (this.actualStep === 0) {
      this.close();
    }
    this.actualStep--;
  }

  /** Regisztráció */
  register() {
    if (this.form.valid) {
      this.authService
        .signup(this.form.controls.email.value as string, this.form.controls.password.value as string)
        .then((cred) => {
          if (cred.user) {
            const newUser: User = {
              id: cred.user.uid,
              email: this.form.value.email as string,
              name: this.form.value.name as string,
              education: this.form.value.education as Education | undefined,
              work: this.form.value.work as Work | undefined,
              other: this.form.value.other as Other | undefined,
              introduction: this.form.value.introduction as string | undefined,
              profileType: this.form.value.profileType as string | undefined,
              followers: [],
              follow: [],
              reviews: [],
              followedNotes: [],
              followersNumber: 0,
              notesNumber: 0,
            };
            this.userService.createProfile(newUser);
            if (this.profilPic()) {
              this.userService.uploadProfilPic(this.profilPic()!, cred.user.uid);
            }
          }
          this.toastService.success('Sikeres regisztráció és belépés!');
          this.dialogRef.close(cred.user);
        })
        .catch(() => {
          this.toastService.error('Váratlan hiba a regisztráció során!');
        });
    }
  }

  /** Profil kép feltöltése */
  uploadProfilPic(event: Event) {
    this.loading.set(true);
    const img = (event.target as HTMLInputElement).files;
    if (img) {
      this.profilPic.set(img[0]);
      this.saveFile(img[0]);
      this.loading.set(false);
    }
  }

  /** Feltöltött fájl mentése */
  saveFile(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.profilPicSrc.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  /** Feltöltött kép törlése */
  deletePic() {
    this.profilPic.set(null);
    this.profilPicSrc.set('');
  }
}
