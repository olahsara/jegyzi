import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TitleComponent } from '../../../shared/components/title/title.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'jegyzi-login',
  standalone: true,
  imports: [
    CommonModule, TitleComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

}
