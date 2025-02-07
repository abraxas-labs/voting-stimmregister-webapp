/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { FilterColumn } from './filter-column';
import { TableDataSource } from '@abraxas/base-components';
import { FilterDefinition } from '../../models/filter/filterDefinition';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss'],
})
export class FilterTableComponent {
  @Input()
  public set filters(filters: FilterDefinition[]) {
    this.filterDatasource.data = filters;
  }

  @Input()
  public title: string = 'filter-overview.my-filter';

  public columns = FilterColumn;
  public filterDatasource = new TableDataSource<FilterDefinition>();
  public columnsToDisplay: string[] = [
    FilterColumn.NAME,
    FilterColumn.DESCRIPTION,
    FilterColumn.LATEST_VERSION,
    FilterColumn.TENANT_NAME,
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  public async openDetailView(filter: FilterDefinition): Promise<void> {
    await this.router.navigate([filter.id], { relativeTo: this.route });
  }
}
