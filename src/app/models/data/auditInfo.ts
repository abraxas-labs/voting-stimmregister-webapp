/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface AuditInfo {
  createdAt: Date;
  createdByName: string;
  modifiedAt?: Date;
  modifiedByName?: string;
}
