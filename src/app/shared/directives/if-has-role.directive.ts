/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from "@angular/core";
import { RoleService } from "src/app/services/role.service";
import { AccessRole } from "../../models/accessRole";

@Directive({
  selector: "[appIfHasRole]"
})
export class IfHasRoleDirective implements OnInit {
  @Input("appIfHasRole")
  public roles?: AccessRole[];

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly roleService: RoleService
  ) {
  }

  public async ngOnInit(): Promise<void> {
    const hasRole = this.roles === undefined
      || await this.roleService.hasExactRoles(...this.roles);

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
