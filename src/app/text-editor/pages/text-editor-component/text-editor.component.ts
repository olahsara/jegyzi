import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { TitleComponent } from '../../../shared/components/title/title.component';

@Component({
  selector: 'jegyzi-text-editor',
  standalone: true,
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
  imports: [
    CommonModule,
    TitleComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
    QuillEditorComponent,
  ],
})
export class TextEditorComponent {
  form = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    subTitle: new FormControl<string | null>(null),
    text: new FormControl<string | null>(null),
  });
}
