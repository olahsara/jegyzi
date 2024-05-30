import {Component} from '@angular/core';
import {HeaderComponent} from "../../../shared/layout/header/header.component";
import {ActivatedRoute} from "@angular/router";
import { TitleComponent } from '../../../shared/components/title/title.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'jegyzi-home-page',
  standalone: true,
  imports: [
    HeaderComponent, TitleComponent, MatTooltip
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  
}
