import {Component} from '@angular/core';
import {HeaderComponent} from "../../../shared/layout/header/header.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  title = this.activatedRoute.snapshot.data['title']
  constructor(private activatedRoute: ActivatedRoute) {

  }
}
