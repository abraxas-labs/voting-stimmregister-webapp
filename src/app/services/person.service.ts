/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  DomainOfInfluenceModel,
  PagingModel,
  PersonModel,
  PersonSearchType as PersonSearchTypeProto,
  PersonServiceClient,
  PersonServiceGetAllRequest,
  PersonServiceGetAllResponse,
  PersonServiceGetByFilterVersionIdRequest,
  PersonServiceGetLastUsedParametersRequest,
  PersonServiceGetSingleRequest,
  PersonServiceGetSingleResponse,
} from '@abraxas/voting-stimmregister-proto';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Person, PersonWithDomainOfInfluences } from '../models/person/person';
import { FilterCriteria } from '../models/filter/filterCriteria';
import { PersonResponseModel } from '../models/person/personResponse.model';
import { DomainOfInfluence } from '../models/domainOfInfluence/domainOfInfluence';
import { FilterService } from './filter.service';
import { PersonSearchParameters, PersonSearchType } from '../models/person/personSearchParameters';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private readonly client = inject(PersonServiceClient);

  public async getLastUsedParameters(
    searchType: PersonSearchType,
    includeEmpty: boolean = true
  ): Promise<PersonSearchParameters> {
    return lastValueFrom(
      this.client.getLastUsedParameters(
        new PersonServiceGetLastUsedParametersRequest({
          searchType: searchType as any as PersonSearchTypeProto,
        })
      )
    ).then((x) => ({
      searchType: x.searchType! as any as PersonSearchType,
      pageSize: x.pageInfo?.pageSize ?? 20,
      pageIndex: x.pageInfo?.pageIndex ?? 0,
      criteria: FilterService.mapFilterCriteria(
        includeEmpty ? x.criteria : x.criteria?.filter((c) => c.filterValue !== '')
      ),
    }));
  }

  public async getAll(params: PersonSearchParameters): Promise<PersonResponseModel> {
    return lastValueFrom(
      this.client.getAll(
        this.mapToPersonGetAllRequest(params.pageIndex, params.pageSize, params.searchType, params.criteria)
      )
    ).then((x) => this.mapPersonsFromResponse(x));
  }

  public async getByFilterVersionId(
    filterVersionId: string,
    pageIndex: number,
    pageSize: number
  ): Promise<PersonResponseModel> {
    return lastValueFrom(
      this.client.getByFilterVersionId(
        this.mapToPersonGetByFilterVersionIdRequest(pageIndex, pageSize, filterVersionId)
      )
    ).then((x) => this.mapPersonsFromResponse(x));
  }

  public async getSingle(registerId: string): Promise<PersonWithDomainOfInfluences> {
    return lastValueFrom(this.client.getSingle(this.mapToPersonGetSingleRequest(registerId))).then((p) =>
      this.mapPersonFromSingleResponse(p)
    );
  }

  private mapToPersonGetAllRequest(
    index: number,
    size: number,
    searchType: PersonSearchType,
    criteria: FilterCriteria[]
  ): PersonServiceGetAllRequest {
    const result = new PersonServiceGetAllRequest();
    result.searchType = searchType as any as PersonSearchTypeProto;
    result.paging = new PagingModel();
    result.paging.pageSize = size;
    result.paging.pageIndex = index;
    result.criteria = FilterService.mapToFilterCriteria(criteria);
    return result;
  }

  private mapToPersonGetByFilterVersionIdRequest(
    index: number,
    size: number,
    filterVersionId: string
  ): PersonServiceGetByFilterVersionIdRequest {
    const result = new PersonServiceGetByFilterVersionIdRequest();
    result.paging = new PagingModel();
    result.paging.pageSize = size;
    result.paging.pageIndex = index;
    result.versionId = filterVersionId;
    return result;
  }

  private mapToPersonGetSingleRequest(registerId: string): PersonServiceGetSingleRequest {
    const result = new PersonServiceGetSingleRequest();
    result.registerId = registerId;
    return result;
  }

  private mapPersonsFromResponse(getPersonsResponse: PersonServiceGetAllResponse): PersonResponseModel {
    const people: Person[] = [];
    getPersonsResponse.people?.forEach((person: PersonModel) => {
      people.push(this.mapPerson(person));
    });
    return {
      totalCount: getPersonsResponse.totalCount!,
      invalidPersonsCount: getPersonsResponse.invalidPersonsCount!,
      people: people,
    };
  }

  private mapPersonFromSingleResponse(person: PersonServiceGetSingleResponse): PersonWithDomainOfInfluences {
    return {
      ...this.mapPerson(person.latest!),
      domainOfInfluences: person.latestDomainOfInfluences?.map((d) => this.mapDomainOfInfluence(d)) ?? [],
    };
  }

  private mapPerson(person: PersonModel): Person {
    const person1: Person = {
      actuality: person.actuality!,
      actualityDate: person.actualityDate?.toDate()!,
      aliasName: person.aliasName,
      allianceName: person.allianceName,
      callName: person.callName,
      contactAddressHouseNumber: person.contactAddressHouseNumber,
      contactAddressLine1: person.contactAddressLine1,
      contactAddressLine2: person.contactAddressLine2,
      contactAddressLine3: person.contactAddressLine3,
      contactAddressLine4: person.contactAddressLine4,
      contactAddressLine5: person.contactAddressLine5,
      contactAddressLine6: person.contactAddressLine6,
      contactAddressLine7: person.contactAddressLine7,
      contactAddressLines: [
        person.contactAddressLine1 ?? '',
        person.contactAddressLine2 ?? '',
        person.contactAddressLine3 ?? '',
        person.contactAddressLine4 ?? '',
        person.contactAddressLine5 ?? '',
        person.contactAddressLine6 ?? '',
        person.contactAddressLine7 ?? '',
      ].filter((x) => x !== ''),
      contactAddressExtensionLine1: person.contactAddressExtensionLine1,
      contactAddressExtensionLine2: person.contactAddressExtensionLine2,
      contactAddressLocality: person.contactAddressLocality,
      contactAddressStreet: person.contactAddressStreet,
      contactAddressTown: person.contactAddressTown,
      contactAddressZipCode: person.contactAddressZipCode,
      contactAddressPostOfficeBoxText: person.contactAddressPostOfficeBoxText,
      contactAddressPostOfficeBoxNumber: person.contactAddressPostOfficeBoxNumber?.value,
      country: person.country,
      dateOfBirth: person.dateOfBirth?.toDate()!,
      dateOfBirthAdjusted: person.dateOfBirthAdjusted,
      domainOfInfluenceId: person.domainOfInfluenceId,
      residenceEntryDate: person.residenceEntryDate?.toDate()!,
      firstName: person.firstName!,
      hasValidationErrors: person.hasValidationErrors!,
      isBirthDateValidForVotingRights: !!person.isBirthDateValidForVotingRights,
      isNationalityValidForVotingRights: !!person.isNationalityValidForVotingRights,
      isVotingAllowed: person.isVotingAllowed!,
      languageOfCorrespondence: person.languageOfCorrespondence,
      moveInArrivalDate: person.moveInArrivalDate?.toDate(),
      moveInCantonAbbreviation: person.moveInCantonAbbreviation,
      moveInComesFrom: person.moveInComesFrom,
      moveInCountryNameShort: person.moveInCountryNameShort,
      moveInMunicipalityName: person.moveInMunicipalityName,
      moveInUnknown: person.moveInUnknown,
      municipalityId: person.municipalityId!,
      municipalityName: person.municipalityName,
      officialName: person.officialName!,
      originalName: person.originalName,
      otherName: person.otherName,
      religion: person.religion,
      residenceAddressHouseNumber: person.residenceAddressHouseNumber,
      residenceAddressExtensionLine1: person.residenceAddressExtensionLine1,
      residenceAddressExtensionLine2: person.residenceAddressExtensionLine2,
      residenceAddressPostOfficeBoxText: person.residenceAddressPostOfficeBoxText,
      residenceAddressStreet: person.residenceAddressStreet,
      residenceAddressTown: person.residenceAddressTown,
      residenceAddressZipCode: person.residenceAddressZipCode!,
      residenceCantonAbbreviation: person.residenceCantonAbbreviation,
      residenceCountry: person.residenceCountry,
      residencePermit: person.residencePermit,
      residencePermitValidFrom: person.residencePermitValidFrom?.toDate(),
      residencePermitValidTill: person.residencePermitValidTill?.toDate(),
      restrictedVotingAndElectionRightFederation: person.restrictedVotingAndElectionRightFederation,
      sex: person.sex,
      sourceSystemId: person.sourceSystemId,
      sourceSystemName: person.sourceSystemName,
      eVoting: person.eVoting,
      eVotingEmail: person.eVotingEmail,
      typeOfResidence: person.typeOfResidence!,
      validationErrors: person.validationErrors,
      vn: person.vn,
      registerId: person.registerId!,
      countryNameShort: person.countryNameShort,
      isSwissAbroad: person.isSwissAbroad === true,
      sendVotingCardsToDomainOfInfluenceReturnAddress:
        person.sendVotingCardsToDomainOfInfluenceReturnAddress === true,
      isHouseholder: person.isHouseholder === true,
      residenceBuildingId: person.residenceBuildingId,
      residenceApartmentId: person.residenceApartmentId,
    };
    return person1;
  }

  private mapDomainOfInfluence(d: DomainOfInfluenceModel): DomainOfInfluence {
    return {
      ...(<Required<DomainOfInfluenceModel.AsObject>>d.toObject()),
    };
  }
}
