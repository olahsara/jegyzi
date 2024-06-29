import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'jegyzi-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jegyzi';
  constructor(private authService: AuthService, private userService: UserService
  ) {
    //TODO: APP_INIT-tel megoldani
    this.authService.loggedInUser().subscribe((data) => {
      if(data) {
        this.userService.getUserById(data.uid).then((element) => {
          this.userService.user.set(element[0]);
        });
      }
    })
  }
}
