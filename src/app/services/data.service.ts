/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { MultipartFromDataHttpService } from './http/multipart-from-data-http.service';
import { ImportType } from '../models/data/importType';
import { environment } from '../../environments/environment';
import { ImportSourceSystem } from '../models/data/importSourceSystem';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(MultipartFromDataHttpService);

  private readonly restApiUrl: string = '';
  private readonly personLogantoEndpoint: string = '/import/loganto/persons';
  private readonly personCobraEndpoint: string = '/import/cobra/persons';
  private readonly personCobraTgEndpoint: string = '/import/cobra-tg/persons';
  private readonly personInnosolvEndpoint: string = '/import/innosolv/persons';
  private readonly doiLogantoEndpoint: string = '/import/loganto/doi';

  constructor() {
    this.restApiUrl = `${environment.restApiEndpoint}`;
  }

  public async uploadData(type: ImportType, sourceSystem: ImportSourceSystem, file?: File): Promise<any> {
    const url = this.getUploadDataUrl(type, sourceSystem);
    return await this.http.post(url, null, file);
  }

  private getUploadDataUrl(type: ImportType, sourceSystem: ImportSourceSystem): string {
    if (type === ImportType.IMPORT_TYPE_PERSON) {
      switch (sourceSystem) {
        case ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO:
          return this.restApiUrl + this.personLogantoEndpoint;
        case ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA:
          return this.restApiUrl + this.personCobraEndpoint;
        case ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA_TG:
          return this.restApiUrl + this.personCobraTgEndpoint;
        case ImportSourceSystem.IMPORT_SOURCE_SYSTEM_INNOSOLV:
          return this.restApiUrl + this.personInnosolvEndpoint;
      }
    }

    if (
      type === ImportType.IMPORT_TYPE_DOMAIN_OF_INFLUENCE &&
      sourceSystem === ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO
    ) {
      return this.restApiUrl + this.doiLogantoEndpoint;
    }
    throw new Error('Invalid import selection');
  }
}
