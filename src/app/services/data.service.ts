/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Empty } from '@ngx-grpc/well-known-types';
import { ImportServiceClient, VerifyManualImportRequest } from '@abraxas/voting-stimmregister-proto';
import { MultipartFromDataHttpService } from './http/multipart-from-data-http.service';
import { ImportType } from '../models/data/importType';
import { environment } from '../../environments/environment';
import { ImportSourceSystem } from '../models/data/importSourceSystem';
import { SecondFactorTransaction, mapSecondFactorTransaction } from '../models/secondFactorTransaction.model';

const SECOND_FACTOR_TRANSACTION_ID_HEADER = 'X-Second-Factor-Transaction-Id';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http = inject(MultipartFromDataHttpService);
  private readonly importClient = inject(ImportServiceClient);

  private readonly restApiUrl: string = '';
  private readonly personLogantoEndpoint: string = '/import/loganto/persons';
  private readonly personCobraEndpoint: string = '/import/cobra/persons';
  private readonly personCobraTgEndpoint: string = '/import/cobra-tg/persons';
  private readonly personInnosolvEndpoint: string = '/import/innosolv/persons';
  private readonly doiLogantoEndpoint: string = '/import/loganto/doi';

  constructor() {
    this.restApiUrl = `${environment.restApiEndpoint}`;
  }

  public uploadData(
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    file?: File,
    secondFactorTransactionId?: string
  ): Promise<any> {
    const url = this.getUploadDataUrl(type, sourceSystem);
    const headers = secondFactorTransactionId
      ? { [SECOND_FACTOR_TRANSACTION_ID_HEADER]: secondFactorTransactionId }
      : undefined;
    return this.http.post(url, null, file, headers);
  }

  public async prepareManualImport(): Promise<SecondFactorTransaction | undefined> {
    const response = await firstValueFrom(this.importClient.prepareManualImport(new Empty()));
    return mapSecondFactorTransaction(response.secondFactorTransaction);
  }

  public verifyManualImport(secondFactorTransactionId: string, otpCode?: string): Observable<void> {
    return this.importClient
      .verifyManualImport(
        new VerifyManualImportRequest({
          secondFactorTransactionId,
          otpCode,
        })
      )
      .pipe(map(() => undefined));
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
