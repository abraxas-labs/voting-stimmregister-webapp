/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { SnackbarService } from '@abraxas/voting-lib';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly injector = inject(Injector);

  public handleError(error: any): void {
    const translateService = this.injector.get<TranslateService>(TranslateService);
    const snackbarService = this.injector.get<SnackbarService>(SnackbarService);

    if (error.promise && error.rejection) {
      // Promise rejection wrapped by zone.js
      error = error.rejection;
    }
    if (error instanceof HttpErrorResponse) {
      this.addAlert(error.error.detail, translateService, snackbarService).subscribe();
    } else {
      // Client Error
      this.addAlert('errors.generic.messageShort', translateService, snackbarService).subscribe();
      console.error(error.message);
    }
  }

  private addAlert(
    alertKey: string,
    translateService: TranslateService,
    snackbarService: SnackbarService
  ): Observable<any> {
    return translateService.get(alertKey).pipe(
      tap((translation) => {
        snackbarService.error(translation);
      }),
      take(1)
    );
  }
}
