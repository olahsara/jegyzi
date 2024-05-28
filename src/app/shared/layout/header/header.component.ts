import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {SwitchButtonComponent} from "../../components/switch-button/switch-button.component";

@Component({
  selector: 'jegyzi-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SwitchButtonComponent,
    RouterOutlet
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
}
