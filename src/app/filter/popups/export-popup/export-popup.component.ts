/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { DropdownItem } from '@abraxas/base-components';
import { TranslateService } from '@ngx-translate/core';
import { ExportService } from '../../../services/export.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

enum ExportType {
  CSV = 'csv',
  ECHV6 = 'echv6',
  STISTAT = 'stistat',
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
  standalone: false,
})
export class ExportPopupComponent {
  private readonly dialogData = inject<ExportPopupData>(MAT_DIALOG_DATA);
  private readonly dialog = inject<MatDialogRef<ExportPopupComponent>>(MatDialogRef);
  private readonly translate = inject(TranslateService);
  private readonly exportService = inject(ExportService);

  public readonly exportTypes: typeof ExportType = ExportType;
  public type: ExportType = ExportType.ECHV6;
  public types: DropdownItem[] = [
    {
      id: ExportType.ECHV6,
      displayValue: this.translate.instant('export-filter.dropdown.echv6'),
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

  constructor() {
    this.invalidPersonCount = this.dialogData.invalidPersonCount;
  }

  public async export(): Promise<void> {
    try {
      this.exporting = true;
      switch (this.type) {
        case ExportType.CSV:
          await this.exportService.exportCSV(this.dialogData.filterId, this.dialogData.versionId);
          break;
        case ExportType.ECHV6:
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
