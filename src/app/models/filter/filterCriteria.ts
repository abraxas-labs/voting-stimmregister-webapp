/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FilterCriteriaReferenceId } from "./filterCriteriaReferenceId";
import { FilterOperationId } from "@abraxas/base-components";

export interface FilterCriteria {
  id: string;
  referenceId: string;
  filterDataType: string;
  filterOperator: FilterOperationId;
  filterValue: any;
}

export function buildSearchDefaultCriteria(): FilterCriteria[] {
  return [
    newFilterCriteria(FilterCriteriaReferenceId.officialName),
    newFilterCriteria(FilterCriteriaReferenceId.firstName),
    newFilterCriteria(FilterCriteriaReferenceId.allianceName),
    newFilterCriteria(FilterCriteriaReferenceId.dateOfBirth),
    newFilterCriteria(FilterCriteriaReferenceId.municipalityName),
    newFilterCriteria(FilterCriteriaReferenceId.residenceAddressStreet),
    newFilterCriteria(FilterCriteriaReferenceId.residenceAddressHouseNumber),
    newFilterCriteria(FilterCriteriaReferenceId.residenceAddressZipCode),
    newFilterCriteria(FilterCriteriaReferenceId.residenceAddressTown)
  ];
}

export function buildFilterDefaultCriteria(): FilterCriteria[] {
  return [
    newFilterCriteria(FilterCriteriaReferenceId.municipalityName),
    newFilterCriteria(FilterCriteriaReferenceId.age),
    newFilterCriteria(FilterCriteriaReferenceId.swissCitizenship),
    newFilterCriteria(FilterCriteriaReferenceId.restrictedVotingAndElectionRightFederation),
    newFilterCriteria(FilterCriteriaReferenceId.religion),
    newFilterCriteria(FilterCriteriaReferenceId.municipalityId)
  ];
}

export function newFilterCriteria(referenceId: FilterCriteriaReferenceId): FilterCriteria {
  switch (referenceId) {
    case FilterCriteriaReferenceId.vn:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "string",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: ""
      };
    case FilterCriteriaReferenceId.municipalityId:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "numeric",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: ""
      };
    case FilterCriteriaReferenceId.restrictedVotingAndElectionRightFederation:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "boolean",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: false
      };
    case FilterCriteriaReferenceId.age:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "numeric",
        filterOperator: FilterOperationId.GREATER_EQUAL,
        filterValue: "18"
      };
    // String without Additions
    case FilterCriteriaReferenceId.municipalityName:
    case FilterCriteriaReferenceId.officialName:
    case FilterCriteriaReferenceId.firstName:
    case FilterCriteriaReferenceId.originalName:
    case FilterCriteriaReferenceId.allianceName:
    case FilterCriteriaReferenceId.aliasName:
    case FilterCriteriaReferenceId.otherName:
    case FilterCriteriaReferenceId.callName:
    case FilterCriteriaReferenceId.originName1_7:
    case FilterCriteriaReferenceId.originOnCanton1_7:
    case FilterCriteriaReferenceId.contactAddressExtensionLine1:
    case FilterCriteriaReferenceId.contactAddressExtensionLine2:
    case FilterCriteriaReferenceId.contactAddressStreet:
    case FilterCriteriaReferenceId.contactAddressHouseNumber:
    case FilterCriteriaReferenceId.contactAddressPostOfficeBoxText:
    case FilterCriteriaReferenceId.contactAddressLine1_7:
    case FilterCriteriaReferenceId.contactAddressTown:
    case FilterCriteriaReferenceId.contactAddressLocality:
    case FilterCriteriaReferenceId.contactAddressZipCode:
    case FilterCriteriaReferenceId.residenceAddressExtensionLine1:
    case FilterCriteriaReferenceId.residenceAddressExtensionLine2:
    case FilterCriteriaReferenceId.residenceAddressStreet:
    case FilterCriteriaReferenceId.residenceAddressHouseNumber:
    case FilterCriteriaReferenceId.residenceAddressPostOfficeBoxText:
    case FilterCriteriaReferenceId.residenceAddressTown:
    case FilterCriteriaReferenceId.residenceAddressZipCode:
    case FilterCriteriaReferenceId.moveInMunicipalityName:
    case FilterCriteriaReferenceId.moveInCantonAbbreviation:
    case FilterCriteriaReferenceId.moveInComesFrom:
    case FilterCriteriaReferenceId.moveInCountryNameShort:
    case FilterCriteriaReferenceId.politicalCircleId:
    case FilterCriteriaReferenceId.politicalCircleName:
    case FilterCriteriaReferenceId.catholicCircleId:
    case FilterCriteriaReferenceId.catholicCircleName:
    case FilterCriteriaReferenceId.evangelicCircleId:
    case FilterCriteriaReferenceId.evangelicCircleName:
    case FilterCriteriaReferenceId.schoolCircleId:
    case FilterCriteriaReferenceId.schoolCircleName:
    case FilterCriteriaReferenceId.trafficCircleId:
    case FilterCriteriaReferenceId.trafficCircleName:
    case FilterCriteriaReferenceId.residentialDistrictCircleId:
    case FilterCriteriaReferenceId.residentialDistrictCircleName:
    case FilterCriteriaReferenceId.peopleCircleId:
    case FilterCriteriaReferenceId.peopleCircleName:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "string",
        filterOperator: FilterOperationId.CONTAINS,
        filterValue: ""
      };
    case FilterCriteriaReferenceId.sex:
    case FilterCriteriaReferenceId.religion:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "multiselect",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: ""
      };
    case FilterCriteriaReferenceId.country:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "multiselect",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: ["CH"]
      };
    case FilterCriteriaReferenceId.eVoting:
    case FilterCriteriaReferenceId.dateOfBirthAdjusted:
    case FilterCriteriaReferenceId.moveInUnknown:
    case FilterCriteriaReferenceId.hasValidationErrors:
    case FilterCriteriaReferenceId.sendVotingCardsToDomainOfInfluenceReturnAddress:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "boolean",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: false
      };
    case FilterCriteriaReferenceId.dateOfBirth:
    case FilterCriteriaReferenceId.residencePermitValidFrom:
    case FilterCriteriaReferenceId.residencePermitValidTill:
    case FilterCriteriaReferenceId.residenceEntryDate:
    case FilterCriteriaReferenceId.moveInArrivalDate:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "date",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: ""
      };
    case FilterCriteriaReferenceId.typeOfResidence:
    case FilterCriteriaReferenceId.residencePermit:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "select",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: ""
      };
    case FilterCriteriaReferenceId.swissCitizenship:
      return {
        id: "",
        referenceId: referenceId,
        filterDataType: "select",
        filterOperator: FilterOperationId.EQUALS,
        filterValue: "1"
      };
    default:
      return {
        filterValue: "",
        filterDataType: "",
        filterOperator: FilterOperationId.CONTAINS,
        id: "",
        referenceId: ""
      };
  }
}
