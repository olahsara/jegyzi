import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../../login/model/user.model';

// export function profileResolver(): ResolveFn<User | undefined> {
//     return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//       const service = inject(AuthService)
  
//       return service.profile;
//     };
//   }
