/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ImportStatistic } from './importStatistic.model';

export interface ImportStatisticResponseModel {
  totalCount: number;
  importStatistics: ImportStatistic[];
}
