/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, Injector, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateFn,
  GuardResult,
} from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MultiGuard {
  public readonly injector = inject(Injector);

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GuardResult> {
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
