import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

// export function profilesResolver(): ResolveFn<User | undefined> {
//     return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//       const service = inject(UserService)
  
      
//     };
//   }
