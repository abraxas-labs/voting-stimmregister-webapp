/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FilterCriteria } from './filterCriteria';
import { FilterVersion } from './filterVersion';
import * as uuid from 'uuid';

export interface FilterDefinition {
  id: string;
  name: string;
  description: string;
  latestVersion?: FilterVersion;
  criteria: FilterCriteria[];
  versions: FilterVersion[];
  tenantName: string;
  tenantId: string;
}

export function newFilter(criteria: FilterCriteria[]): FilterDefinition {
  return {
    criteria,
    versions: [],
    description: '',
    name: '',
    id: uuid.NIL.toString(),
    tenantName: '',
    tenantId: '',
  };
}
