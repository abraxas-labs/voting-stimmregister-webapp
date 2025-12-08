/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { FileDownloadService } from '@abraxas/voting-lib';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private readonly fileDownloader = inject(FileDownloadService);

  private readonly restApiUrl: string = '';

  constructor() {
    this.restApiUrl = `${environment.restApiEndpoint}/export`;
  }

  public exportCSV(filterId: string, versionId?: string): Promise<void> {
    return this.fileDownloader.postDownloadFile(this.restApiUrl + '/csv', { filterId, versionId });
  }

  public exportStistat(filterId: string, versionId?: string): Promise<void> {
    return this.fileDownloader.postDownloadFile(this.restApiUrl + '/stistat', { filterId, versionId });
  }

  public exportEch0045(filterId: string, versionId?: string): Promise<void> {
    return this.fileDownloader.postDownloadFile(this.restApiUrl + '/ech-0045', { filterId, versionId });
  }
}
