import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MyProfilePageComponent } from '../my-profile-page/my-profile-page.component';
import { ProfileTypes, User } from '../../../shared/models/user.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { EducationType } from '../../../shared/models/eductaion.model';

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
  templateUrl: './profile-modify-modal-page.component.html',
  styleUrl: './profile-modify-modal-page.component.scss',
})
export class ProfileModifyModalPageComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<MyProfilePageComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA);

  steps = [0,1];
  actualStep = 0;

  error? : string;
  profileTypes = ProfileTypes;
  educationTypes = EducationType;

  form = new FormGroup({
    email: new FormControl<string| null>(null, {
      validators: Validators.email,
    }),
    name: new FormGroup({
      firstName: new FormControl<string| null>(null),
      lastName: new FormControl<string| null>(null),
    }),
    profileType: new FormControl<string | null>(null),
    education: new FormGroup({
      institution: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null),
      year: new FormControl<number | null>(null),
      specialization: new FormControl<string | null>(null)
    }),
    introduction: new FormControl<string | null>(null),

    //Not editable datas
    id: new FormControl<string | null>(null),
    followers: new FormControl<string[] | null>(null),
    follow: new FormControl<string[] | null>(null),
    followersNumber: new FormControl<number | null>(null),
  });

  ngOnInit(): void {
    if(this.data){
      this.form.setValue({
        email: this.data.email || null,
        name: {
          lastName: this.data.name?.lastName || null,
          firstName: this.data.name?.firstName || null,

        },
        profileType: this.data.profileType || null,
        education: {
          institution: this.data.education?.institution || null,
          specialization: this.data.education?.specialization || null,
          year: this.data.education?.year || null,
          type: this.data.education?.type || null,
        },
        introduction: this.data.introduction || null,
        //Not editable datas
        follow: this.data.follow || [],
        followers: this.data.followers || [],
        followersNumber: this.data.followersNumber || 0,
        id: this.data.id || null

      })
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  next(){
    this.actualStep++;
    if(this.steps.length === this.actualStep){
      this.modify();
    }
  }
  prew(){
    if(this.actualStep === 0) {
      this.close();
    }
    this.actualStep--;
  }

  modify() {
    if(this.form.valid){
      this.actualStep = 0;
      this.dialogRef.close(this.form.getRawValue());
    } else {
      console.log(this.form.errors)
      this.error = 'Email cím formátuma nem megfelelő!'
    }
  }
 }
