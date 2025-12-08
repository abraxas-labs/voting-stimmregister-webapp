/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { first, firstValueFrom, Observable } from 'rxjs';
import { AuthorizationService, RoleService as IamRoleService } from '@abraxas/base-components';
import { AccessRole } from '../models/accessRole';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roles = inject(IamRoleService);
  private readonly auth = inject(AuthorizationService);

  public get isReaderOrManager$(): Observable<boolean> {
    return this.roles.hasRole([AccessRole.Reader, AccessRole.Manager]);
  }

  public isReaderOrManager(): Promise<boolean> {
    return firstValueFrom(this.isReaderOrManager$.pipe(first()));
  }

  public get isManager$(): Observable<boolean> {
    return this.roles.hasRole([AccessRole.Manager]);
  }

  public isManager(): Promise<boolean> {
    return firstValueFrom(this.isManager$.pipe(first()));
  }

  public get isExporter$(): Observable<boolean> {
    return this.roles.hasRole([AccessRole.Exporter]);
  }

  public isExporter(): Promise<boolean> {
    return firstValueFrom(this.isExporter$.pipe(first()));
  }

  public get isManualImporter$(): Observable<boolean> {
    return this.roles.hasRole([AccessRole.ManualImporter]);
  }

  public isManualImporter(): Promise<boolean> {
    return firstValueFrom(this.isManualImporter$.pipe(first()));
  }

  public get isApiImporter$(): Observable<boolean> {
    return this.roles.hasRole([AccessRole.ApiImporter]);
  }

  public isApiImporter(): Promise<boolean> {
    return firstValueFrom(this.isApiImporter$.pipe(first()));
  }

  public hasExactRoles(...roles: AccessRole[]): Promise<boolean> {
    return firstValueFrom(this.roles.hasRole(roles));
  }

  public async hasAnyRoles(...roles: AccessRole[]): Promise<boolean> {
    let authRoles = await this.auth.getRoles();
    return roles.filter((r) => authRoles.includes(r)).length > 0;
  }
}
