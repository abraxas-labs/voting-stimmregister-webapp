/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface RegistrationStatistic {
  municipalityId?: number;
  municipalityName: string;
  registrationsCount: number;
  deregistrationCount: number;
  totalEvoterCount: number;
  totalVoterCount: number;
  evoterShare: number;
}
