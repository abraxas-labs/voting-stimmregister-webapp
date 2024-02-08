/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuditInfo } from "../models/data/auditInfo";
import {
  AuditInfoModel
} from "@abraxas/voting-stimmregister-proto";

export class AuditInfoService {
  public static map(ai: AuditInfoModel): AuditInfo {
    return {
      created_at: ai.createdAt!.toDate(),
      modified_at: ai.modifiedAt?.toDate(),
      created_by_name: ai.createdByName!,
      modified_by_name: ai.modifiedByName,
    };
  }
}
