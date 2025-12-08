/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Component,
  ErrorHandler,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { PageEvent, PaginatorComponent, SortDirective, TableDataSource } from '@abraxas/base-components';
import { TableColumn } from './data-table.data';
import { ImportType } from '../../../models/data/importType';
import { ImportStatistic } from '../../../models/data/importStatistic.model';
import { ImportStatisticService } from '../../../services/import-statistic.service';
import { ImportStatusSimple } from '../../../models/data/ImportStatusSimple';
import { ImportSourceSystem } from '../../../models/data/importSourceSystem';
import { ImportSource } from '../../../models/data/ImportSource';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: false,
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy {
  private readonly errorHandler = inject(ErrorHandler);
  private readonly importStatisticService = inject(ImportStatisticService);

  @Input()
  public type!: ImportType;

  @Input()
  public source: ImportSource = ImportSource.IMPORT_SOURCE_ALL;

  @Input()
  public sourceSystem!: ImportSourceSystem;

  @Input()
  public state?: ImportStatusSimple;

  @Input()
  public selectedRow?: ImportStatistic;

  @Output()
  public selectedRowChange = new EventEmitter<ImportStatistic | undefined>();

  @ViewChild(PaginatorComponent, { static: true })
  public paginator!: PaginatorComponent;

  @ViewChild(SortDirective, { static: true })
  public sort!: SortDirective;

  public columns = TableColumn;
  public columnsToDisplay: string[] = [
    TableColumn.SOURCE,
    TableColumn.MUNICIPALITY,
    TableColumn.CREATEDBY,
    TableColumn.LATESTUPDATE,
    TableColumn.DURATION,
    TableColumn.RECORDS,
    TableColumn.STATE,
  ];

  private fetchImportStatiticSubscription: Subscription | undefined;

  public totalCount: number = 0;
  public datasource = new TableDataSource<ImportStatistic>();

  public pagination: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0,
  };

  public ngOnInit(): void {
    this.loadData();
    this.fetchImportStatiticSubscription = this.importStatisticService.fetchImportStatitic.subscribe(() => {
      this.loadData();
    });

    const dataAccessor = (data: ImportStatistic, filterId: string) => {
      if (filterId === TableColumn.LATESTUPDATE) {
        return data.auditInfo.modifiedAt ?? '';
      } else if (filterId === TableColumn.CREATEDBY) {
        return data.auditInfo.createdByName ?? '';
      }

      return (data as Record<string, any>)[filterId];
    };

    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    this.datasource.sortingDataAccessor = dataAccessor;
  }

  public ngOnDestroy() {
    this.fetchImportStatiticSubscription?.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    if (!this.type || !this.state) {
      return;
    }

    try {
      const response = await this.importStatisticService.getListOfImports(
        this.type,
        this.sourceSystem,
        this.source,
        this.state,
        this.pagination.pageIndex,
        this.pagination.pageSize
      );

      this.datasource.data = response.importStatistics;
      this.totalCount = response.totalCount;
      this.pagination.length = this.totalCount;
    } catch (e) {
      this.errorHandler.handleError(e);
    }
  }

  public selectRow(importStatistic: ImportStatistic): void {
    this.selectedRow = importStatistic;
    this.selectedRowChange.emit(importStatistic);
  }
}
