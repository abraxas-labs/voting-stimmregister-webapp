/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Canton, DomainOfInfluenceType } from "@abraxas/voting-stimmregister-proto";

export interface DomainOfInfluence {
  name: string;
  identifier: string;
  canton: Canton;
  domainOfInfluenceType: DomainOfInfluenceType;
}
