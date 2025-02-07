/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { GrpcEvent, GrpcMessage, GrpcRequest, GrpcStatusEvent } from '@ngx-grpc/common';
import { GrpcHandler } from '@ngx-grpc/core';
import { GrpcInterceptor } from '@ngx-grpc/core/lib/grpc-interceptor';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class GrpcErrorToastInterceptor implements GrpcInterceptor {
  constructor(
    private readonly i18n: TranslateService,
    private readonly toast: ToastService
  ) {}

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(
    request: GrpcRequest<Q, S>,
    next: GrpcHandler
  ): Observable<GrpcEvent<S>> {
    return next
      .handle(request)
      .pipe(
        switchMap((event) =>
          event instanceof GrpcStatusEvent && event.statusCode ? this.handleGrpcError(event) : of(event)
        )
      );
  }

  private handleGrpcError(err: GrpcStatusEvent): Observable<never> {
    // async workflow is needed
    // if the first api call fails, the translations aren't loaded yet...
    const titlePromise = this.tryTranslationKeys(
      err,
      `errors.${err.statusCode}.title`,
      'errors.generic.title'
    );
    const msgPromise = this.tryTranslationKeys(
      err,
      `errors.${err.statusCode}.message`,
      'errors.generic.message'
    );
    Promise.all([titlePromise, msgPromise]).then(([title, msg]) => this.toast.error(title, msg));
    return throwError(() => new Error(err.statusMessage));
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
