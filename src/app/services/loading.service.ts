/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new Subject<boolean>();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private requests: HttpRequest<any>[] = [];

  addRequest(req: HttpRequest<any>): void {
    this.requests.push(req);
    this.loadingSubject.next(true);
  }

  removeRequest(req: HttpRequest<any>): void {
    const index = this.requests.indexOf(req);
    if (index >= 0) {
      this.requests.splice(index, 1);
    }
    if (this.requests.length === 0) {
      this.loadingSubject.next(false);
    }
  }
}
