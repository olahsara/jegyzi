import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jegyzi-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  private activatedRoute = inject(ActivatedRoute);
  title = this.activatedRoute.snapshot.data['title'];
  subtitle? = this.activatedRoute.snapshot.data['subtitle'];
  info? = this.activatedRoute.snapshot.data['info'];
}
