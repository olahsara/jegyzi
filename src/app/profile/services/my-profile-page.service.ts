import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

// export function getLastRouteData(route: ActivatedRouteSnapshot | ActivatedRoute): Data | Observable<Data> {
//   const chain = getRouteChain(route);
//   const lastRoute = chain[chain.length - 1];
//   return lastRoute.data;
// }

@Injectable()
export class MyProfilePageService {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  readonly profile = this.userService.user;

  // constructor(private entityPropertyNameInRouteData: string, private idPropertyInRouteParams = 'id') {
  //   this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
  //     const params = getLastRouteParams(this.activatedRoute.snapshot);
  //     this.id.set(params['id'] as string);
  //   });

  //   this.activatedRoute.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
  //     const data = getLastRouteData(this.activatedRoute.snapshot);
  //     this._entity.set(data[this.entityPropertyNameInRouteData] as TEntity);
  //   });
  // }

  reload(updated?: User) {
    console.log(updated);
    const value = updated ? updated : this.getProfile();
    this.profile.set(value);
  }

  getProfile() {
    const data = this.userService.user();
    return data;
  }
}
