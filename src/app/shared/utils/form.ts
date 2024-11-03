import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export const FORM_DIRECTIVES = [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule] as const;
