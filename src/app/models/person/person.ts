/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ValidationResultModel } from "./validationResultModel";
import { ImportSourceSystem } from "../data/importSourceSystem";
import { DomainOfInfluence } from "../domainOfInfluence/domainOfInfluence";
import { Sex } from "./sex";

export interface Person {
  registerId: string;
  vn?: string;
  domainOfInfluenceId?: string;
  sourceSystemId?: string;
  sourceSystemName?: ImportSourceSystem;
  officialName: string;
  firstName: string;
  sex?: Sex;
  dateOfBirth: Date;
  dateOfBirthAdjusted?: boolean;
  originalName?: string;
  allianceName?: string;
  aliasName?: string;
  otherName?: string;
  callName?: string;
  languageOfCorrespondence?: string;
  religion?: string;
  restrictedVotingAndElectionRightFederation?: boolean;
  country?: string;
  eVoting?: boolean;
  municipalityName?: string;
  municipalityId: number;
  typeOfResidence: string;
  residencePermit?: string;
  residencePermitValidFrom?: Date;
  residencePermitValidTill?: Date;
  residenceEntryDate?: Date;
  contactAddressExtensionLine1?: string;
  contactAddressExtensionLine2?: string;
  contactAddressStreet?: string;
  contactAddressHouseNumber?: string;
  contactAddressPostOfficeBoxText?: string;
  contactAddressPostOfficeBoxNumber?: number;
  contactAddressLine1?: string;
  contactAddressLine2?: string;
  contactAddressLine3?: string;
  contactAddressLine4?: string;
  contactAddressLine5?: string;
  contactAddressLine6?: string;
  contactAddressLine7?: string;
  contactAddressLines: string[];
  contactAddressTown?: string;
  contactAddressLocality?: string;
  contactAddressZipCode?: string;
  residenceAddressExtensionLine1?: string;
  residenceAddressExtensionLine2?: string;
  residenceAddressStreet?: string;
  residenceAddressHouseNumber?: string;
  residenceAddressPostOfficeBoxText?: string;
  residenceAddressTown?: string;
  residenceCantonAbbreviation?: string;
  residenceCountry?: string;
  residenceAddressZipCode: string;
  moveInArrivalDate?: Date;
  moveInMunicipalityName?: string;
  moveInCantonAbbreviation?: string;
  moveInComesFrom?: string;
  moveInCountryNameShort?: string;
  moveInUnknown?: boolean;
  isBirthDateValidForVotingRights?: boolean;
  isNationalityValidForVotingRights?: boolean;
  isVotingAllowed: boolean;
  actuality: boolean;
  actualityDate: Date;
  validationErrors?: { [prop: string]: ValidationResultModel };
  hasValidationErrors?: boolean;
  countryNameShort?: string;
  isSwissAbroad: boolean;
  sendVotingCardsToDomainOfInfluenceReturnAddress: boolean;
}

export interface PersonWithDomainOfInfluences extends Person {
  domainOfInfluences: DomainOfInfluence[];
}
