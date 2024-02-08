/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ErrorHandler, OnInit } from "@angular/core";
import { TableDataSource } from "@abraxas/base-components";
import { FilterColumn } from "./filter-column";
import { FilterService } from "../../services/filter.service";
import { FilterDefinition } from "../../models/filter/filterDefinition";
import { ActivatedRoute, Router } from "@angular/router";
import { RoleService } from "src/app/services/role.service";

@Component({
  selector: 'app-filter-overview',
  templateUrl: './filter-overview.component.html',
  styleUrls: ['./filter-overview.component.scss']
})
export class FilterOverviewComponent implements OnInit {

  public isManager: boolean = false;
  public loaded: boolean = false;
  public columns = FilterColumn;
  public columnsToDisplay: string[] = [
    FilterColumn.NAME,
    FilterColumn.DESCRIPTION,
    FilterColumn.LATEST_VERSION,
  ];
  public filters = new TableDataSource<FilterDefinition>();

  constructor(
    private readonly filterService: FilterService,
    private readonly roleService: RoleService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly errorHandler: ErrorHandler,
  ) {
  }

  public async ngOnInit(): Promise<void> {
    this.isManager = await this.roleService.isManager();
    this.loadData();
  }

  private loadData(): void {
    this.filterService.getAll().then(filters => {
      this.filters.data = filters;
      this.loaded = true;
    }).catch(e => this.errorHandler.handleError(e));
  }

  public async openDetailView(filter: FilterDefinition): Promise<void> {
    await this.router.navigate([filter.id], {relativeTo: this.route});
  }

  public async openCreateView(): Promise<void> {
    await this.router.navigate(['new'], {relativeTo: this.route});
  }
}
