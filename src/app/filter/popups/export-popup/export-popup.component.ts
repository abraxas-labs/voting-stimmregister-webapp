/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { DropdownItem } from '@abraxas/base-components';
import { TranslateService } from '@ngx-translate/core';
import { ExportService } from '../../../services/export.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

enum ExportType {
  CSV = 'csv',
  ECH = 'ech',
  STISTAT = 'stistat'
}

export interface ExportPopupData {
  filterId: string;
  versionId: string;
  invalidPersonCount: number;
}

@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss'],
})
export class ExportPopupComponent {
  public readonly exportTypes: typeof ExportType = ExportType;
  public type: ExportType = ExportType.ECH;
  public types: DropdownItem[] = [
    {
      id: ExportType.ECH,
      displayValue: this.translate.instant('export-filter.dropdown.ech'),
      disabled: false,
    },
    {
      id: ExportType.CSV,
      displayValue: this.translate.instant('export-filter.dropdown.csv'),
      disabled: false,
    },
    {
      id: ExportType.STISTAT,
      displayValue: this.translate.instant('export-filter.dropdown.stistat'),
      disabled: false,
    },
  ];

  public readonly invalidPersonCount: number;

  public exporting: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly dialogData: ExportPopupData,
    private readonly dialog: MatDialogRef<ExportPopupComponent>,
    private readonly translate: TranslateService,
    private readonly exportService: ExportService
  ) {
    this.invalidPersonCount = dialogData.invalidPersonCount;
  }

  public async export(): Promise<void> {
    try {
      this.exporting = true;
      switch (this.type) {
        case ExportType.CSV:
          await this.exportService.exportCSV(this.dialogData.filterId, this.dialogData.versionId);
          break;
        case ExportType.ECH:
          await this.exportService.exportEch0045(this.dialogData.filterId, this.dialogData.versionId);
          break;
        case ExportType.STISTAT:
          await this.exportService.exportStistat(this.dialogData.filterId, this.dialogData.versionId);
          break;
      }
      this.dialog.close();
    } finally {
      this.exporting = false;
    }
  }
}
