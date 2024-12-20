import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'jegyzi-my-notes-shell-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './my-notes-shell-page.component.html',
  styleUrl: './my-notes-shell-page.component.scss',
})
export class MyNotesShellPagesComponent {}
