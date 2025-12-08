/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ListRegistrationStatisticRequest,
  ListRegistrationStatisticResponse,
  MunicipalityRegistrationStatisticModel,
  RegistrationStatisticServiceClient,
  RegistrationStatisticModel,
} from '@abraxas/voting-stimmregister-proto';
import { lastValueFrom } from 'rxjs';
import { RegistrationStatistic } from '../models/registration/registrationStatistic';
import { RegistrationStatisticResponseModel } from '../models/registration/registrationStatisticResponse.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationStatisticService {
  private readonly client = inject(RegistrationStatisticServiceClient);
  private readonly translate = inject(TranslateService);

  @Output() public fetchRegistrationStatitic: EventEmitter<any> = new EventEmitter<any>();

  public async listRegistrationStatistics(): Promise<RegistrationStatisticResponseModel> {
    return lastValueFrom(this.client.list(this.mapToListRegistrationStatisticRequest())).then((l) =>
      this.mapToRegistrationStatisticResponse(l)
    );
  }

  private mapToListRegistrationStatisticRequest(): ListRegistrationStatisticRequest {
    return new ListRegistrationStatisticRequest();
  }

  private mapToRegistrationStatisticResponse(
    response: ListRegistrationStatisticResponse
  ): RegistrationStatisticResponseModel {
    const statistics: RegistrationStatistic[] = [];

    if (response.isTopLevelAuthority) {
      statistics.push(
        this.mapToRegistrationStatistic(
          response.totalRegistrationStatistic!,
          this.translate.instant('registration.statistics.topLevelAuthorityName'),
          0
        )
      );
    }

    statistics.push(...this.mapToRegistrationStatistics(response.municipalityRegistrationStatistics!));

    return {
      totalCount: statistics.length,
      registrationStatistics: statistics,
    };
  }

  private mapToRegistrationStatistics(
    registrationStatistics: MunicipalityRegistrationStatisticModel[]
  ): RegistrationStatistic[] {
    const statistics: RegistrationStatistic[] = [];
    registrationStatistics.forEach((municipalityStatistic) => {
      statistics.push(
        this.mapToRegistrationStatistic(
          municipalityStatistic.registrationStatistic!,
          municipalityStatistic.municipalityName!,
          municipalityStatistic.municipalityId
        )
      );
    });
    return statistics;
  }

  private mapToRegistrationStatistic(
    registrationStatistic: RegistrationStatisticModel,
    municipalityName: string,
    municipalityId?: number
  ): RegistrationStatistic {
    const statistic: RegistrationStatistic = {
      municipalityName: municipalityName,
      municipalityId: municipalityId,
      evoterShare: registrationStatistic.evoterShare ?? 0,
      totalEvoterCount: registrationStatistic.evoterTotalCount ?? 0,
      totalVoterCount: registrationStatistic.voterTotalCount ?? 0,
    };
    return statistic;
  }
}
