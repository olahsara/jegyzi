import { inject } from '@angular/core';
import type {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';

export function myProfileResolver(): ResolveFn<User | void> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const service = inject(UserService);
    const authService = inject(AuthService);
    service.getUserById(authService.getUid()!).then((element) => {
      element.docs.map((doc) => {
        console.log(doc.data());
        return doc.data();
      });
    });
  };
}
