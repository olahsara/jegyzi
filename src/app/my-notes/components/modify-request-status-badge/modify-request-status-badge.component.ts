import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { ModifyRequestSeriusness } from '../../../shared/models/modifiy-request.model';

@Component({
  selector: 'jegyzi-modify-request-status-badge',
  standalone: true,
  imports: [CommonModule, MatTooltip],
  templateUrl: './modify-request-status-badge.component.html',
  styleUrl: './modify-request-status-badge.component.scss',
})
export class ModifyRequestStatusBadgeComponent {
  seriusness = input.required<ModifyRequestSeriusness>();
  modifyRequestSeriusness = ModifyRequestSeriusness;
}
