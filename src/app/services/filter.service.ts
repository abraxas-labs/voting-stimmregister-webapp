/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from "@angular/core";
import { FilterDefinition } from "../models/filter/filterDefinition";
import {
  FilterCriteriaModel,
  FilterDataType,
  FilterDefinitionModel,
  FilterOperator,
  FilterReference,
  FilterServiceClient,
  FilterServiceCreateFilterVersionRequest,
  FilterServiceDeleteFilterRequest,
  FilterServiceDeleteFilterVersionRequest,
  FilterServiceDuplicateFilterRequest,
  FilterServiceGetAllRequest,
  FilterServiceGetAllResponse,
  FilterServiceGetSingleRequest,
  FilterServiceGetSingleResponse,
  FilterServiceRenameFilterVersionRequest,
  FilterServiceSaveFilterRequest,
  FilterVersionModel
} from "@abraxas/voting-stimmregister-proto";
import { lastValueFrom } from "rxjs";
import { FilterCriteria } from "../models/filter/filterCriteria";
import { FilterVersion } from "../models/filter/filterVersion";
import * as uuid from "uuid";
import * as googleProtobuf002 from "@ngx-grpc/well-known-types";
import { ConverterHelpers } from "../shared/helpers/converter.helpers";
import { AuditInfoService } from "./audit-info.service";
import { FilterOperationId } from "@abraxas/base-components";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private readonly client: FilterServiceClient) {
  }

  public async getAll(): Promise<FilterDefinition[]> {
    return lastValueFrom(this.client.getAll(new FilterServiceGetAllRequest()))
      .then(f => this.mapFiltersFromResponse(f));
  }

  public async getSingle(id: string) : Promise<FilterDefinition> {
    return lastValueFrom(this.client.getSingle(this.mapToFilterGetSingleRequest(id)))
      .then(f => this.mapFilterFromResponse(f));
  }

  public async save(id: string | undefined, name: string, description: string, criteria: FilterCriteria[]) : Promise<string> {
    const request = this.mapToFilterSaveRequest(id, name, description, criteria);
    const response = await lastValueFrom(this.client.save(request));
    return response.id!;
  }

  public async delete(id: string) : Promise<void> {
    const request = this.mapToFilterDeleteRequest(id);
    return lastValueFrom(this.client.delete(request))
      .then(_ => {});
  }

  public async duplicate(id: string) : Promise<string> {
    const request = this.mapToFilterDuplicateRequest(id);
    const newId = await lastValueFrom(this.client.duplicate(request));
    return newId.id!;
  }

  public async createVersion(filterId: string, name: string, deadline: Date) : Promise<void> {
    const request = this.mapToFilterVersionCreateRequest(filterId, name, deadline);
    await lastValueFrom(this.client.createVersion(request));
  }

  public async renameVersion(filterVersionId: string, name: string) : Promise<void> {
    const request = this.mapToFilterVersionRenameRequest(filterVersionId, name);
    await lastValueFrom(this.client.renameVersion(request));
  }

  public async deleteVersion(filterVersionId: string) : Promise<void> {
    const request = this.mapToFilterVersionDeleteRequest(filterVersionId);
    await lastValueFrom(this.client.deleteVersion(request));
  }

  private mapFiltersFromResponse(response: FilterServiceGetAllResponse): FilterDefinition[] {
    const filters = response.filters?.map(this.mapFilter.bind(this));
    return filters!;
  }

  private mapFilterFromResponse(response: FilterServiceGetSingleResponse) : FilterDefinition {
    return this.mapFilter(response.filter!);
  }

  private mapFilter(model: FilterDefinitionModel) : FilterDefinition {
    return {
      latestVersion: model.latestVersion === undefined ? undefined : this.mapVersion(model.latestVersion),
      description: model.description!,
      criteria: FilterService.mapFilterCriteria(model.criteria!),
      id: model.id!,
      name: model.name!,
      versions: this.mapVersions(model.versions!),
    };
  }

  private mapToFilterSaveRequest(id: string | undefined, name: string, description: string, criteria: FilterCriteria[]) : FilterServiceSaveFilterRequest {
    const request = new FilterServiceSaveFilterRequest();
    request.filterId = id;
    request.name = name;
    request.description = description;
    request.criteria = FilterService.mapToFilterCriteria(criteria);
    return request;
  }

  private mapToFilterVersionCreateRequest(filterId: string, name: string, deadline: Date) : FilterServiceCreateFilterVersionRequest {
    const request = new FilterServiceCreateFilterVersionRequest();
    request.filterId = filterId;
    request.name = name;
    request.deadline = googleProtobuf002.Timestamp.fromDate(deadline);
    return request;
  }

  private mapToFilterVersionRenameRequest(filterVersionId: string, name: string) : FilterServiceRenameFilterVersionRequest {
    const request = new FilterServiceRenameFilterVersionRequest();
    request.filterVersionId = filterVersionId;
    request.name = name;
    return request;
  }

  private mapToFilterVersionDeleteRequest(filterVersionId: string) : FilterServiceDeleteFilterVersionRequest {
    const request = new FilterServiceDeleteFilterVersionRequest();
    request.filterVersionId = filterVersionId;
    return request;
  }

  private mapToFilterDeleteRequest(filterId: string) : FilterServiceDeleteFilterRequest {
    const request = new FilterServiceDeleteFilterRequest();
    request.filterId = filterId;
    return request;
  }

  private mapToFilterDuplicateRequest(filterId: string) : FilterServiceDuplicateFilterRequest {
    const request = new FilterServiceDuplicateFilterRequest();
    request.filterId = filterId;
    return request;
  }

  private mapToFilterGetSingleRequest(id: string) : FilterServiceGetSingleRequest {
    const request = new FilterServiceGetSingleRequest();
    request.filterId = id;
    return  request;
  }

  public static mapFilterCriteria(filterCriteriaModel?: FilterCriteriaModel[]): FilterCriteria[] {
    if (filterCriteriaModel === undefined) {
      return [];
    }

    const properties: FilterCriteria[] = []
    filterCriteriaModel.forEach(c => {
      const property: FilterCriteria = {
        id: c.id!,
        filterDataType: this.snakeToCamel(FilterDataType[c.filterDataType!].substring("FILTER_DATA_TYPE_".length)),
        filterOperator: this.mapFilterOperator(c.filterOperator),
        referenceId: this.referenceIdToString(c.referenceId!),
        filterValue: c.filterDataType === FilterDataType.FILTER_DATA_TYPE_MULTISELECT
          ? c.filterValue!.split(",")
          : c.filterValue!
      }
      properties.push(property);
    })
    return properties;
  }

  public static mapToFilterCriteria(criteria: FilterCriteria[]): FilterCriteriaModel[] {
    const result: FilterCriteriaModel[] = [];
    criteria.forEach(c => {
      const a = new FilterCriteriaModel();
      a.id = this.mapToId(c.id);
      a.filterValue = c.filterValue.toString();
      a.filterOperator = FilterOperator["FILTER_OPERATOR" + ConverterHelpers.splitCamelCaseToSnakeCase(c.filterOperator) as keyof typeof FilterOperator];
      a.filterDataType = FilterDataType["FILTER_DATA_TYPE_" + c.filterDataType.toUpperCase() as keyof typeof FilterDataType];
      a.referenceId = FilterReference["FILTER_REFERENCE" + ConverterHelpers.splitCamelCaseToSnakeCase(c.referenceId) as keyof typeof FilterReference];
      result.push(a);
    });
    return result;
  }

  private static mapToId(id: string): string {
    if (id) {
      return id;
    } else {
      return uuid.NIL.toString();
    }
  }

  private static referenceIdToString(referenceId: FilterReference) : string {
    return this.snakeToCamel(FilterReference[referenceId]
      .substring("FILTER_REFERENCE_".length));
  }

  private static snakeToCamel(value: string) : string {
    return value.toLowerCase().replace(/([-_][a-z])/g, group =>
      group
        .toUpperCase()
        .replace('-', '')
        .replace('_', ''))

      // replace the underline if a number follows on a char
      // eg. CANTON_1_2 gets replaced to canton_1_2 by the above
      // but is expected as canton1_2
      .replace(/([a-zA-Z])_(\d)/, '$1$2');
  }

  private mapVersions(v: FilterVersionModel[]): FilterVersion[] {
    return v.map(x => this.mapVersion(x));
  }

  private mapVersion(v: FilterVersionModel): FilterVersion {
    return {
      count: v.count!,
      countOfInvalidPersons: v.countOfInvalidPersons!,
      audit_info: AuditInfoService.map(v.auditInfo!),
      deadline: v.deadline!.toDate(),
      criteria: FilterService.mapFilterCriteria(v.criteria!),
      id: v.id!,
      name: v.name!
    };
  }

  private static mapFilterOperator(o?: FilterOperator): FilterOperationId {
    switch (o) {
      case FilterOperator.FILTER_OPERATOR_CONTAINS:
        return FilterOperationId.CONTAINS;
      case FilterOperator.FILTER_OPERATOR_STARTS_WITH:
        return FilterOperationId.STARTS_WITH;
      case FilterOperator.FILTER_OPERATOR_ENDS_WITH:
        return FilterOperationId.ENDS_WITH;
      case FilterOperator.FILTER_OPERATOR_LESS:
        return FilterOperationId.LESS;
      case FilterOperator.FILTER_OPERATOR_LESS_EQUAL:
        return FilterOperationId.LESS_EQUAL;
      case FilterOperator.FILTER_OPERATOR_GREATER:
        return FilterOperationId.GREATER;
      case FilterOperator.FILTER_OPERATOR_GREATER_EQUAL:
        return FilterOperationId.GREATER_EQUAL;
      default:
        return FilterOperationId.EQUALS;
    }
  }
}
