/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {FileDownloadService} from "@abraxas/voting-lib";

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly restApiUrl: string = '';

  constructor(private readonly fileDownloader: FileDownloadService) {
    this.restApiUrl = `${environment.restApiEndpoint}/export`;
  }

  public exportCSV(filterId: string, versionId?: string): Promise<void> {
    return this.fileDownloader.postDownloadFile(
      this.restApiUrl + '/csv',
      {filterId, versionId});
  }

  public exportEch0045(filterId: string, versionId?: string): Promise<void> {
    return this.fileDownloader.postDownloadFile(
      this.restApiUrl + '/ech-0045',
      {filterId, versionId});
  }
}
