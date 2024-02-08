/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FilterCriteria } from "../filter/filterCriteria";

export enum PersonSearchType {
  Unspecified = 0,
  Person = 1,
  Filter = 2
}

export interface PersonSearchParameters {
  searchType: PersonSearchType;
  criteria: FilterCriteria[];
  pageIndex: number;
  pageSize: number;
}
