/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnDestroy } from "@angular/core";
import {
  SegmentedControl
} from "@abraxas/base-components/lib/components/formfields/segmented-control-group/segmented-control.model";
import { TranslateService } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { UploadDataPopupComponent } from "../upload-data-popup/upload-data-popup.component";
import { AccessRole } from "../../models/accessRole";
import { Subscription } from "rxjs";
import { ImportStatistic } from "../../models/data/importStatistic.model";
import { ImportType } from "../../models/data/importType";
import { ImportSourceSystem } from "../../models/data/importSourceSystem";
import { ImportSource } from "../../models/data/ImportSource";
import { ImportStatisticService } from "src/app/services/import-statistic.service";
import { ImportStatusSimple } from "../../models/data/ImportStatusSimple";

@Component({
  selector: 'app-data-overview',
  templateUrl: './data-overview.component.html',
  styleUrls: ['./data-overview.component.scss']
})
export class DataOverviewComponent implements OnDestroy {

  public readonly roles: typeof AccessRole = AccessRole;
  public readonly importTypes: typeof ImportType = ImportType;
  public readonly importSourceSystems: typeof ImportSourceSystem = ImportSourceSystem;
  public readonly importSource: typeof ImportSource = ImportSource;
  public readonly importStatusSimple: typeof ImportStatusSimple = ImportStatusSimple;

  public segments: SegmentedControl[] = [
    {
      value: ImportStatusSimple.IMPORT_STATUS_SIMPLE_ALL,
      displayText: this.translate.instant('data-overview.segments.all'),
      disabled: false
    },
    {
      value: ImportStatusSimple.IMPORT_STATUS_SIMPLE_FAILED,
      displayText: this.translate.instant('data-overview.segments.error'),
      disabled: false
    },
    {
      value: ImportStatusSimple.IMPORT_STATUS_SIMPLE_SUCCESS,
      displayText: this.translate.instant('data-overview.segments.success'),
      disabled: false
    }
  ];

  public columnsToDisplay: string[] = [
    "record",
    "record_identifier",
    "field",
    "error"
  ]
  private sharedDataServiceSubscription: Subscription | undefined;
  private pollImportStatisticInterval?: number; // TODO: Replace polling with notification: VOTING-2854
  public selectedHistoryStatistic?: ImportStatistic;
  public selectedDetailStatistic?: ImportStatistic;
  public filter: ImportStatusSimple = ImportStatusSimple.IMPORT_STATUS_SIMPLE_ALL;

  constructor(
    private readonly importStatisticService: ImportStatisticService,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog) {
  }

  public ngOnDestroy(): void {
    this.sharedDataServiceSubscription?.unsubscribe();
    if (this.pollImportStatisticInterval) {
      clearInterval(this.pollImportStatisticInterval);
      delete this.pollImportStatisticInterval;
    }
  }

  public openUploadPopup(): void {
    const dialog = this.dialog.open(UploadDataPopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '465px',
      autoFocus: 'dialog'
    });
    const popupComponent = dialog.componentInstance as UploadDataPopupComponent
    const uploadedEvent = popupComponent.uploaded.subscribe((value) => {
      this.importStatisticService.fetchImportStatitic.emit();
      if (!this.pollImportStatisticInterval) {
        this.pollImportStatisticInterval = setInterval(() => {
          this.importStatisticService.fetchImportStatitic.emit();
        }, 15000);
      }
    });

    const closeEvent = dialog.afterClosed().subscribe(() => {
      uploadedEvent.unsubscribe();
      closeEvent.unsubscribe();
    });
  }

  public selectHistory(stats?: ImportStatistic): void {
    this.selectedDetailStatistic = this.selectedHistoryStatistic = stats;
  }
}
