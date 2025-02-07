/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FieldValidationError } from './fieldValidationError.model';

export interface RecordValidationError {
  recordNumber: number;
  recordIdentifier: string;
  field: FieldValidationError[];
}
