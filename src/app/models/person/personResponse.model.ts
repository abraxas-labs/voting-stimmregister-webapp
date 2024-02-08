/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {Person} from "./person";

export interface PersonResponseModel {
  people: Person[];
  totalCount: number;
  invalidPersonsCount: number;
}
