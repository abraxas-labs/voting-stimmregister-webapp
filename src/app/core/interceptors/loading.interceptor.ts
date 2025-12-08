/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loadingService = inject(LoadingService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.addRequest(req);

    return new Observable((observer) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.loadingService.removeRequest(req);
            observer.next(event);
          }
        },
        (err) => {
          this.loadingService.removeRequest(req);
          observer.error(err);
        },
        () => {
          this.loadingService.removeRequest(req);
          observer.complete();
        }
      );

      // remove request from queue when cancelled
      return () => {
        this.loadingService.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
