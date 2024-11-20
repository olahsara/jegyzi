import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'jegyzi-rating-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  /** Válaszotott csillaggal visszatérő esemény  */
  selectRate = output<number>();

  /** Aktuális csillagok száma */
  currentRate = input.required<number>();

  /** Választás (interakció) letiltása */
  disabled = input<boolean>(false);

  /** Szöveg */
  label = input<string>();

  /** Értékelés lehetséges értékei */
  stars = [1, 2, 3, 4, 5];
}
