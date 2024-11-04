import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'jegyzi-my-notes-shell-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './my-notes-shell-page.component.html',
  styleUrl: './my-notes-shell-page.component.scss',
})
export class MyNotesShellPagesComponent {}
