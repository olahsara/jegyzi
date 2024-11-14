import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

export function profileResolver(): ResolveFn<User> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const service = inject(UserService);

    const id = route.params['id'] as string;
    return service.getUserById(id).then((element) => {
      return element;
    });
  };
}
