/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MultiGuard  {
  public constructor(public readonly injector: Injector) {}
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return from(route.data.guardList).pipe(
      concatMap((value: any) => {
        const guard = this.injector.get<{
    canActivate: CanActivateFn;
}>(value);
        const result = guard.canActivate(route, state);
        if (result instanceof Observable) {
          return result;
        } else if (result instanceof Promise) {
          return from(result);
        } else {
          return of(result);
        }
      }),
      first((x) => x === false || x instanceof UrlTree, true)
    );
  }
}
