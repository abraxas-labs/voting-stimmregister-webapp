/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ErrorHandler, OnInit } from "@angular/core";
import { FilterService } from "../../services/filter.service";
import { FilterDefinition } from "../../models/filter/filterDefinition";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleService } from "src/app/services/role.service";
import { AuthorizationService, Tenant } from "@abraxas/base-components";

@Component({
  selector: 'app-filter-overview',
  templateUrl: './filter-overview.component.html',
  styleUrls: ['./filter-overview.component.scss'],
})
export class FilterOverviewComponent implements OnInit {
  public isManager: boolean = false;
  public loaded: boolean = false;
  public myFilters: FilterDefinition[] = [];
  public aggregateFilters: FilterDefinition[] = [];

  constructor(
    private readonly filterService: FilterService,
    private readonly roleService: RoleService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly errorHandler: ErrorHandler,
    private readonly authorization: AuthorizationService
  ) {}

  public async ngOnInit(): Promise<void> {
    const tenant = await this.authorization.getActiveTenant();
    this.isManager = await this.roleService.isManager();
    this.loadData(tenant);
  }

  private loadData(tenant: Tenant): void {
    this.filterService
      .getAll()
      .then((filters) => {
        this.myFilters = filters.filter((f) => (f.tenantId === tenant.id));
        this.aggregateFilters = filters.filter((f) => (f.tenantId !== tenant.id));
        this.loaded = true;
      })
      .catch((e) => this.errorHandler.handleError(e));
  }

  public async openCreateView(): Promise<void> {
    await this.router.navigate(['new'], {relativeTo: this.route});
  }
}
