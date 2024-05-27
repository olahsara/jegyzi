import { Component } from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip";
import {Theme, ThemeService} from "../services/theme.service";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'jegyzi-switch-button',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltip,
    NgClass
  ],
  templateUrl: './switch-button.component.html',
  styleUrl: './switch-button.component.scss'
})
export class SwitchButtonComponent {
  theme = this.themeService.theme;

  constructor(private themeService: ThemeService) {
  }
  switchMode(theme: Theme) {
    this.themeService.setTheme(theme);
  }

}
