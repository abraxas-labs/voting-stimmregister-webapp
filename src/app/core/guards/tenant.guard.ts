/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthStorage } from 'angular-oauth2-oidc';
import { AuthorizationService } from '@abraxas/base-components';

@Injectable({
  providedIn: 'root',
})
export class TenantGuard  {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly storage: OAuthStorage
  ) {}

  public canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    if (!this.storage.getItem('tenant')) {
      return this.authorizationService.getActiveTenant();
    } else {
      return Promise.resolve();
    }
  }
}
