/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ErrorHandler, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { PageEvent, PaginatorComponent, TableDataSource } from '@abraxas/base-components';
import { HistoryColumn } from './history-column';
import { ImportStatisticService } from '../../../services/import-statistic.service';
import { ImportStatistic } from '../../../models/data/importStatistic.model';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss'],
  standalone: false,
})
export class HistoryTableComponent {
  private readonly importStatisticService = inject(ImportStatisticService);
  private readonly errorHandler = inject(ErrorHandler);

  public columns = HistoryColumn;
  public columnsToDisplay: string[] = [
    HistoryColumn.LATESTUPDATE,
    HistoryColumn.DURATION,
    HistoryColumn.PERSONS,
    HistoryColumn.STATE,
  ];

  public hasDetail: boolean = false;
  public isLoading: boolean = false;

  public totalCount: number = 0;
  public datasource = new TableDataSource<ImportStatistic>();

  public pagination: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
  };

  public importStats: ImportStatistic | undefined;

  @Input()
  public set importStatistic(importStats: ImportStatistic | undefined) {
    this.importStats = importStats;
    this.datasource.paginator = this.paginator;
    this.loadData();
  }

  @Input()
  public selectedStatistic?: ImportStatistic;

  @Output()
  private selectedStatisticChange = new EventEmitter<ImportStatistic>();

  @ViewChild(PaginatorComponent, { static: true })
  public paginator!: PaginatorComponent;

  public selectHistory(row: ImportStatistic) {
    if (row.id === this.selectedStatistic?.id) {
      return;
    }

    this.selectedStatistic = row;
    this.selectedStatisticChange.emit(row);
  }

  private async loadData(): Promise<void> {
    if (this.importStats === undefined) {
      this.datasource = new TableDataSource();
      this.totalCount = 0;
      this.hasDetail = false;
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.importStatisticService.getHistoryOfImport(
        this.importStats.importType,
        this.importStats.sourceSystem,
        this.importStats.municipalityId,
        this.pagination.pageIndex,
        this.pagination.pageSize
      );

      this.datasource.data = response.importStatistics;
      this.totalCount = response.totalCount;
      this.pagination.length = this.totalCount;
      this.hasDetail = true;
    } catch (e) {
      this.errorHandler.handleError(e);
    } finally {
      this.isLoading = false;
    }
  }
}
