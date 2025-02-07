/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly i18n: TranslateService
  ) {}

  public success(message: string): void {
    this.show(message);
  }

  public saved(): void {
    this.show('shared.state.saved');
  }

  public deleted(): void {
    this.show('shared.state.deleted');
  }

  public error(title: string, message: string): void {
    this.show(`${title}: ${message}`, 4000);
  }

  private show(message: string, duration = 2000): void {
    this.snackBar.open(this.i18n.instant(message), undefined, { duration });
  }
}
