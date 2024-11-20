import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LabelButtonDirective } from '../../directives/label-button.directive';
import { Label, LabelGroup, LabelNote } from '../../models/label.model';

@Component({
  selector: 'jegyzi-label-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LabelButtonDirective],
  templateUrl: './label-group.component.html',
  styleUrls: ['./label-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelGroupComponent {
  /** Választott címkéket nyilvántartó form control */
  control = model.required<FormControl<LabelNote[]>>();

  /** Címkék */
  items = input.required<LabelGroup>();

  /**
   * Címke kiválasztása
   * @param label címke
   */
  select(label: Label) {
    const fineded = this.control().value.find((l) => l.label.id === label.id);
    if (fineded) {
      const newValues = this.control().value.filter((l) => l.label.id !== label.id);
      this.control().setValue(newValues);
    } else {
      this.control().setValue([...this.control().value, { groupId: this.items().id, label: label }]);
    }
  }
}
