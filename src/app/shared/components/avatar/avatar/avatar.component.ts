import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { NamePipe } from '../../../pipes/name.pipe';
import { UserService } from '../../../services/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'jegyzi-avatar',
  standalone: true,
  imports: [
    CommonModule, NamePipe, MatTooltipModule
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent implements OnInit {
  
  @Input({required: true}) profile!: User;
  @Input() size: string = "md";
  @Input() editable: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if(this.userService.user()?.id !== this.profile.id) {
      this.editable = false;
    }
  }

  upload(){
    // TODO: Képfeltöltés
  }
 }
