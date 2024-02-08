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
} from "@angular/core";
import { PageEvent } from "@abraxas/base-components";
import { DataColumn } from "./data-column";
import { ImportType } from "../../../models/data/importType";
import { ImportStatistic } from "../../../models/data/importStatistic.model";
import { ImportStatisticService } from "../../../services/import-statistic.service";
import { ImportStatusSimple } from "../../../models/data/ImportStatusSimple";
import { ImportSourceSystem } from "../../../models/data/importSourceSystem";
import { ImportSource } from "../../../models/data/ImportSource";
import { BehaviorSubject, Subscription } from "rxjs";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy {

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

  public columns = DataColumn;
  public columnsToDisplay: string[] = [
    DataColumn.SOURCE,
    DataColumn.MUNICIPALITY,
    DataColumn.CREATEDBY,
    DataColumn.LATESTUPDATE,
    DataColumn.DURATION,
    DataColumn.RECORDS,
    DataColumn.STATE,
  ];

  private fetchImportStatiticSubscription: Subscription | undefined;

  public totalCount: number = 0;
  public datasource = new BehaviorSubject<ImportStatistic[]>([]);

  public pagination: PageEvent = {
    length: 0,
    pageIndex: 0,
    pageSize: 5,
    previousPageIndex: 0,
  };

  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly importStatisticService: ImportStatisticService) {
  }

  public ngOnInit(): void {
    this.loadData();
    this.fetchImportStatiticSubscription = this.importStatisticService.fetchImportStatitic.subscribe(() => {
      this.loadData();
    });
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

    try{
      const response = await this.importStatisticService.getListOfImports(
        this.type,
        this.sourceSystem,
        this.source,
        this.state,
        this.pagination.pageIndex,
        this.pagination.pageSize );

      this.datasource.next(response.importStatistics);
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

  paginatorListener(page: PageEvent) {
    this.pagination = page;
    this.loadData();
  }
}
