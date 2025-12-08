/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ImportStatus } from '../../../models/data/importStatus';

type iconColor = 'basic' | 'error' | 'info' | 'success' | 'warning' | 'none';

@Component({
  selector: 'app-data-import-status-icon',
  templateUrl: './data-import-status-icon.component.html',
  styleUrls: ['./data-import-status-icon.component.scss'],
  standalone: false,
})
export class DataImportStatusIconComponent {
  public color: iconColor = 'basic';
  public icon: string = '';
  public statusValue: ImportStatus = ImportStatus.IMPORT_STATUS_UNSPECIFIED;

  @Input()
  public set status(s: ImportStatus) {
    this.color = this.getColor(s);
    this.icon = this.getIcon(s);
    this.statusValue = s;
  }

  private getColor(importStatus: ImportStatus): iconColor {
    switch (importStatus) {
      case ImportStatus.IMPORT_STATUS_FINISHEDWITHERRORS:
        return 'warning';
      case ImportStatus.IMPORT_STATUS_ABORTED:
      case ImportStatus.IMPORT_STATUS_STALE:
      case ImportStatus.IMPORT_STATUS_FAILED:
        return 'error';
      case ImportStatus.IMPORT_STATUS_FINISHEDSUCCESSFULLY:
        return 'success';
      default:
        return 'basic';
    }
  }

  private getIcon(importStatus: ImportStatus): string {
    switch (importStatus) {
      case ImportStatus.IMPORT_STATUS_QUEUED:
        return 'repeat';
      case ImportStatus.IMPORT_STATUS_RUNNING:
        return 'play';
      case ImportStatus.IMPORT_STATUS_ABORTED:
      case ImportStatus.IMPORT_STATUS_FINISHEDWITHERRORS:
      case ImportStatus.IMPORT_STATUS_STALE:
      case ImportStatus.IMPORT_STATUS_FAILED:
        return 'exclamation-triangle-o';
      case ImportStatus.IMPORT_STATUS_FINISHEDSUCCESSFULLY:
        return 'checkmark';
      default:
        return 'question-circle-o';
    }
  }
}
