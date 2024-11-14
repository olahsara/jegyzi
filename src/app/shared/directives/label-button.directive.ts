import { Directive, effect, ElementRef, inject, input, Renderer2, untracked } from '@angular/core';
import { Label, LabelNote } from '../models/label.model';

@Directive({
  selector: '[jegyziLabelButton]',
  standalone: true,
})
/** Címkék megjelenésének módosítása státuszuk alapján */
export class LabelButtonDirective {
  private elementRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private renderer = inject(Renderer2);

  /** Kiválasztott címkék */
  selectedItems = input.required<LabelNote[]>();

  /** Aktuális címke */
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

  /** Kiválasztott megjelenés beállítása */
  setSelectedClass(element: HTMLButtonElement) {
    const selected = element.querySelector("[class*='note-label-selected']");

    if (!selected) {
      this.renderer.addClass(element, 'note-label-selected');
    }
  }

  /** Kiválasztott megjelenés törlése */
  removeSelectedClass(element: HTMLButtonElement) {
    this.renderer.removeClass(element, 'note-label-selected');
  }
}
