import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.model";

export function profileResolver(): ResolveFn<User> {
    return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const service = inject(UserService);
  
      const id = route.params['id'] as string;
      return service.getUserById(id).then((element) => {return element[0];});
    };
  }