/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ImportStatus } from './importStatus';
import { ImportType } from './importType';
import { RecordValidationError } from './recordValidationError.model';
import { ImportSourceSystem } from './importSourceSystem';
import { AuditInfo } from './auditInfo';

export interface ImportStatistic {
  id: string;
  importRecordsCountTotal: number;
  datasetsCountCreated: number;
  datasetsCountUpdated: number;
  datasetsCountDeleted: number;
  auditInfo: AuditInfo;
  finishedDate: Date;
  totalElapsedMilliseconds: string;
  municipalityId: number;
  municipalityName: string;
  processingErrors: string;
  hasValidationErrors: boolean;
  entitiesWithValidationErrors: string[];
  recordNumbersWithValidationErrors: number[];
  recordValidationErrors: RecordValidationError[];
  importStatus: ImportStatus;
  importType: ImportType;
  sourceSystem: ImportSourceSystem;
}
