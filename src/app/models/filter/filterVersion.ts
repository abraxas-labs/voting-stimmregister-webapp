/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FilterCriteria } from './filterCriteria';
import { AuditInfo } from '../data/auditInfo';

export interface FilterVersion {
  id: string;
  name: string;
  auditInfo: AuditInfo;
  deadline: Date;
  count: number;
  countOfInvalidPersons: number;
  criteria: FilterCriteria[];
}
