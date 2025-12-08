/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultipartFromDataHttpService {
  private readonly http = inject(HttpClient);

  public async post<TData, TResponse>(url: string, data: TData, file?: File): Promise<TResponse> {
    return firstValueFrom(
      this.http.post<TResponse>(url, MultipartFromDataHttpService.buildFormData(data, file))
    );
  }

  private static buildFormData(data: any, file?: File): FormData {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (!!file) {
      formData.append('file', file);
    }

    return formData;
  }
}
