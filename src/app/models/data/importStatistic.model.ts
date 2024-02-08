/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {ImportStatus} from "./importStatus";
import {ImportType} from "./importType";
import {RecordValidationError} from "./recordValidationError.model";
import { ImportSourceSystem } from "./importSourceSystem";
import { AuditInfo } from "./auditInfo";

export interface ImportStatistic {
  id: string,
  import_records_count_total: number,
  datasets_count_created: number,
  datasets_count_updated: number,
  datasets_count_deleted: number,
  audit_info: AuditInfo,
  finished_date: Date,
  total_elapsed_milliseconds: string,
  municipality_id: number,
  municipality_name: string,
  processing_errors: string,
  has_validation_errors: boolean,
  entities_with_validation_errors: string[],
  record_numbers_with_validation_errors: number[],
  record_validation_errors: RecordValidationError[],
  import_status: ImportStatus,
  import_type: ImportType,
  source_system: ImportSourceSystem,
}
