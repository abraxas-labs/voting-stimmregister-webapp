/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class RestErrorToastInterceptor implements HttpInterceptor {
  private readonly toast = inject(ToastService);
  private readonly i18n = inject(TranslateService);

  private readonly restApiEndpoint = environment.serviceUrl;

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(this.restApiEndpoint)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const problem = err.error as HttpProblemDetails;
        return this.handleRestError(problem);
      })
    );
  }

  public handleRestError(err: HttpProblemDetails): Observable<never> {
    const titlePromise = this.tryTranslationKeys(err, `errors.${err.status}.title`, 'errors.generic.title');
    const msgPromise = this.tryTranslationKeys(err, `errors.${err.status}.message`, 'errors.generic.message');
    Promise.all([titlePromise, msgPromise]).then(([title, msg]) => this.toast.error(title, msg));
    return throwError(() => new Error(err.title));
  }

  private async tryTranslationKeys(interpolateParams?: any, ...keys: string[]): Promise<string> {
    for (const key of keys) {
      const translated = await lastValueFrom(this.i18n.get(key, interpolateParams));
      if (translated !== key) {
        return translated;
      }
    }
    return keys[keys.length - 1];
  }
}

interface HttpProblemDetails {
  title: string;
  detail: string;
  status: number;
}
