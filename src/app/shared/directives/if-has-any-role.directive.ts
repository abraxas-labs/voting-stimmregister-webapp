/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { AccessRole } from '../../models/accessRole';

@Directive({
  selector: '[appIfHasAnyRole]',
  standalone: false,
})
export class IfHasAnyRoleDirective implements OnInit {
  private readonly templateRef = inject<TemplateRef<any>>(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly roleService = inject(RoleService);

  @Input('appIfHasAnyRole')
  public roles?: AccessRole[];

  public async ngOnInit(): Promise<void> {
    const hasRole = this.roles === undefined || (await this.roleService.hasAnyRoles(...this.roles));

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
