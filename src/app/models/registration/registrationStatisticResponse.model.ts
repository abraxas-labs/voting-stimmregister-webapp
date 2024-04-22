/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { RegistrationStatistic } from './registrationStatistic';

export interface RegistrationStatisticResponseModel {
  registrationStatistics: RegistrationStatistic[];
  totalCount: number;
}
