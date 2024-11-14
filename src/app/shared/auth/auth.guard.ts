import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { UserService } from '../services/user.service';

/** Bejelentkezett felhasználók által megtekinthető oldalak védése a vendég felhasználók elől */
export function authGuard(): CanActivateFn & CanActivateChildFn {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const userService = inject(UserService);
    const router = inject(Router);
    const STORAGE_USER_KEY = 'user';
    const localstorage = inject<Storage>(LOCAL_STORAGE, { optional: true });

    const user = userService.user();

    if (user) {
      return true;
    }
    if (localstorage?.getItem(STORAGE_USER_KEY)) {
      const data = await userService.getUserById(localstorage!.getItem(STORAGE_USER_KEY)!);
      return data ? true : router.createUrlTree(['/']);
    }
    return router.createUrlTree(['/']);
  };
}
