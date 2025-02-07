/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FilterDirective,
  FilterOperationId,
  PaginatorComponent,
  SortDirective,
  TableDataSource,
} from '@abraxas/base-components';
import { RegistrationStatisticsTableColumn } from './registration-statistics-table.data';
import { RegistrationStatisticService } from '../../services/registration-statistic.service';
import { RegistrationStatistic } from '../../models/registration/registrationStatistic';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-registration-statistics-table',
  templateUrl: './registration-statistics-table.component.html',
  styleUrls: ['./registration-statistics-table.component.scss'],
})
export class RegistrationStatisticsTableComponent implements OnInit {
  @ViewChild(FilterDirective, { static: true })
  public filter!: FilterDirective;

  @ViewChild(PaginatorComponent, { static: true })
  public paginator!: PaginatorComponent;

  @ViewChild(SortDirective, { static: true })
  public sort!: SortDirective;

  public loading: boolean = true;
  public columns = RegistrationStatisticsTableColumn;
  public columnsToDisplay: string[] = [
    RegistrationStatisticsTableColumn.MUNICIPALITY_NAME,
    RegistrationStatisticsTableColumn.TOTAL_EVOTER_COUNT,
    RegistrationStatisticsTableColumn.TOTAL_VOTER_COUNT,
    RegistrationStatisticsTableColumn.EVOTER_SHARE,
    RegistrationStatisticsTableColumn.EVOTER_SHARE_CHART,
  ];

  public municipalityFilterItems: any[] = [];

  public totalCount: number = 0;
  public dataSource = new TableDataSource<RegistrationStatistic>();
  public operation = FilterOperationId;

  constructor(private readonly registrationStatisticService: RegistrationStatisticService) {}

  public async ngOnInit(): Promise<void> {
    await this.loadRegistrationStatistics();
    this.dataSource.filter = this.filter;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public calculateBarWidth(percentage: number): number {
    const width = (percentage * 100) / environment.maxEvoterSharePercentage;
    return width > 100 ? 100 : width;
  }

  public calculateBarColor(percentage: number): string {
    return percentage >= environment.thresholdEvoterSharePercentage ? '#AF4035' : '#4CAF50';
  }

  private async loadRegistrationStatistics(): Promise<void> {
    this.loading = true;
    try {
      const registrationStatisticResponse =
        await this.registrationStatisticService.listRegistrationStatistics();
      this.dataSource.data = registrationStatisticResponse.registrationStatistics;
      this.totalCount = registrationStatisticResponse.totalCount;
      this.municipalityFilterItems = registrationStatisticResponse.registrationStatistics.map(
        (row) => row.municipalityName
      );
    } finally {
      this.loading = false;
    }
  }
}
