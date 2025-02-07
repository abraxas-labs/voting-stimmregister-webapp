/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuditInfo } from '../models/data/auditInfo';
import { AuditInfoModel } from '@abraxas/voting-stimmregister-proto';

export class AuditInfoService {
  public static map(ai: AuditInfoModel): AuditInfo {
    return {
      createdAt: ai.createdAt!.toDate(),
      modifiedAt: ai.modifiedAt?.toDate(),
      createdByName: ai.createdByName!,
      modifiedByName: ai.modifiedByName,
    };
  }
}
