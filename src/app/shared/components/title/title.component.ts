import { Component, Input } from '@angular/core';
import {CommonModule} from "@angular/common";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jegyzi-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent {
  title = this.activatedRoute.snapshot.data['title']
  subtitle? = this.activatedRoute.snapshot.data['subtitle']

  constructor(private activatedRoute: ActivatedRoute) {

}
}
