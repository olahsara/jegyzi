import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Theme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'jegyzi-switch-button',
  standalone: true,
  imports: [CommonModule, MatTooltip],
  templateUrl: './switch-button.component.html',
  styleUrl: './switch-button.component.scss',
})
export class SwitchButtonComponent {
  private themeService = inject(ThemeService);

  /** Aktuális téma */
  theme = this.themeService.theme;

  /** Téma váltása
   * @param theme a választott téma
   */
  switchMode(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
