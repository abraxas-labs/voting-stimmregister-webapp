/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  private readonly roleService = inject(RoleService);

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (route.data.role) {
      return this.roleService.hasAnyRoles(...route.data.role);
    } else {
      throw new Error('No role set for the RoleGuard');
    }
  }
}
