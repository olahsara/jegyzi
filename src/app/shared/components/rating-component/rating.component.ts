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
  selectRate = output<number>();
  currentRate = input.required<number>();
  disabled = input<boolean>(false);
  label = input<string>();

  stars = [1, 2, 3, 4, 5];
}
