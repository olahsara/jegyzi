import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

/**A FORM_DIRECTIVES-ben található Module-okat formok létrehozásánál szükségesek, könnyebb őket egyszerre beimportálni */
export const FORM_DIRECTIVES = [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatCheckboxModule] as const;
