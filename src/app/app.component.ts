import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'jegyzi-root',
  standalone: true,
  imports: [RouterOutlet],
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
          element.docs.map((doc) => {
            this.userService.user.set(doc.data());
          });
        });
      }
    })
  }
}
