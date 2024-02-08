/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {FieldValidationError} from "./fieldValidationError.model";

export interface RecordValidationError {
  record_number: number,
  record_identifier: string,
  field: FieldValidationError[],
}
