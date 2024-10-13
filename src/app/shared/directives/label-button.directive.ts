import { Directive, effect, ElementRef, inject, input, Renderer2, untracked } from '@angular/core';
import { Label, LabelNote } from '../models/label.model';

@Directive({
  selector: '[jegyziLabelButton]',
  standalone: true,
})
export class LabelButtonDirective {
  private elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private renderer = inject(Renderer2);

  selectedItems = input.required<LabelNote[]>();
  item = input.required<Label>();

  constructor() {
    effect(() => {
      const item = this.item();
      const selectedItems = this.selectedItems();
      const element = this.elementRef.nativeElement;
      untracked(() => {
        const finded = selectedItems.find((l) => l.label.id === item.id);
        if (finded) {
          this.setSelectedClass(element);
        } else {
          this.removeSelectedClass(element);
        }
      });
    });
  }

  setSelectedClass(element: HTMLButtonElement) {
    const selected = element.querySelector("[class*='label-selected']");

    if (!selected) {
      this.renderer.addClass(element, 'label-selected');
    }
  }

  removeSelectedClass(element: HTMLButtonElement) {
    this.renderer.removeClass(element, 'label-selected');
  }
}
