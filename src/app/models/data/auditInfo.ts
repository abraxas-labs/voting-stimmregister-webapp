/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface AuditInfo {
  created_at: Date;
  created_by_name: string;
  modified_at?: Date;
  modified_by_name?: string;
}
