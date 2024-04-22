/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export enum RegistrationStatisticsTableColumn {
  MUNICIPALITY_NAME = 'municipalityName',
  REGISTRATION_COUNT = 'registrationsCount',
  DEREGISTRATION_COUNT = 'deregistrationCount',
  TOTAL_EVOTER_COUNT = 'totalEvoterCount',
  TOTAL_VOTER_COUNT = 'totalVoterCount',
  EVOTER_SHARE = 'evoterShare',
  EVOTER_SHARE_CHART = 'evoterShareChart',
}

export interface RegistrationStatisticsTableRow {
  [RegistrationStatisticsTableColumn.MUNICIPALITY_NAME]: string;
  [RegistrationStatisticsTableColumn.REGISTRATION_COUNT]: number;
  [RegistrationStatisticsTableColumn.DEREGISTRATION_COUNT]: number;
  [RegistrationStatisticsTableColumn.TOTAL_EVOTER_COUNT]: number;
  [RegistrationStatisticsTableColumn.TOTAL_VOTER_COUNT]: number;
  [RegistrationStatisticsTableColumn.EVOTER_SHARE]: number;
}
