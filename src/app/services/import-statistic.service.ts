/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, Output } from "@angular/core";
import {
  FieldValidationErrorModel,
  GetImportStatisticHistoryRequest,
  GetImportStatisticHistoryResponse,
  ImportSource,
  ImportStatisticModel,
  ImportStatisticServiceClient,
  ListImportStatisticsRequest,
  ListImportStatisticsResponse,
  PagingModel,
  RecordValidationErrorModel
} from "@abraxas/voting-stimmregister-proto";
import { lastValueFrom } from "rxjs";
import { ImportStatisticResponseModel } from "../models/data/importStatisticResponse.model";
import { ImportStatistic } from "../models/data/importStatistic.model";
import { RecordValidationError } from "../models/data/recordValidationError.model";
import { FieldValidationError } from "../models/data/fieldValidationError.model";
import { ImportType } from "../models/data/importType";
import { ImportStatusSimple } from "../models/data/ImportStatusSimple";
import { ImportSourceSystem } from "../models/data/importSourceSystem";
import { EventEmitter } from '@angular/core';
import { AuditInfoService } from "./audit-info.service";

@Injectable({
  providedIn: 'root'
})
export class ImportStatisticService {
  @Output() public fetchImportStatitic: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly client: ImportStatisticServiceClient) {
  }

  public async getListOfImports(
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    source: ImportSource,
    state: ImportStatusSimple,
    pageIndex: number,
    pageSize: number): Promise<ImportStatisticResponseModel> {

    return lastValueFrom(this.client.list(this.mapToListImportStatisticRequest(pageIndex, pageSize, type, sourceSystem, source, state))).then(l => this.mapToImportStatisticList(l));
  }

  public async getHistoryOfImport(
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    municipalityId: number,
    pageIndex: number,
    pageSize: number): Promise<ImportStatisticResponseModel> {
      
    const request = this.mapToImportStatisticHistoryRequest(pageIndex, pageSize, type, sourceSystem, municipalityId);
    return lastValueFrom(this.client.getHistory(request)).then(h => this.mapToImportStatisticHistory(h));
  }

  private mapToListImportStatisticRequest(
    index: number,
    size: number, 
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    source: ImportSource,
    state: ImportStatusSimple): ListImportStatisticsRequest {

    const req = new ListImportStatisticsRequest();
    req.paging = new PagingModel();
    req.paging.pageIndex = index;
    req.paging.pageSize = size;
    req.importSource = source;
    req.importType = type;
    req.importSourceSystem = sourceSystem;
    req.importStatusSimple = state;
    return req;
  }

  private mapToImportStatisticList(listImportStatisticResponse: ListImportStatisticsResponse): ImportStatisticResponseModel {
    return {
      totalCount: listImportStatisticResponse.totalCount!,
      importStatistics: this.mapToImportStatistics(listImportStatisticResponse.importStatistics!)
    }
  }

  private mapToImportStatisticHistoryRequest(
    index: number,
    size: number,
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    municipalityId: number): GetImportStatisticHistoryRequest {

    const req = new GetImportStatisticHistoryRequest();
    req.paging = new PagingModel();
    req.paging.pageIndex = index;
    req.paging.pageSize = size;
    req.municipalityId = municipalityId;
    req.importType = type;
    req.importSourceSystem = sourceSystem;
    return req;
  }

  private mapToImportStatisticHistory(importStatisticHistoryResponse: GetImportStatisticHistoryResponse): ImportStatisticResponseModel {
    return {
      totalCount: importStatisticHistoryResponse.totalCount!,
      importStatistics: this.mapToImportStatistics(importStatisticHistoryResponse.importStatistics!)
    }
  }

  private mapToImportStatistics(importStatistics: ImportStatisticModel[]): ImportStatistic[] {
    const statistics: ImportStatistic[] = [];
    importStatistics.forEach(statisticsModels => {
      const statistic: ImportStatistic = {
        datasets_count_created: statisticsModels.datasetsCountCreated!,
        datasets_count_deleted: statisticsModels.datasetsCountDeleted!,
        datasets_count_updated: statisticsModels.datasetsCountUpdated!,
        entities_with_validation_errors: statisticsModels.entitiesWithValidationErrors!,
        finished_date: statisticsModels.finishedDate?.toDate()!,
        has_validation_errors: statisticsModels.hasValidationErrors!,
        id: statisticsModels.id!,
        import_status: statisticsModels.importStatus!,
        import_type: statisticsModels.importType!,
        import_records_count_total: statisticsModels.importRecordsCountTotal!,
        municipality_id: statisticsModels.municipalityId!,
        municipality_name: statisticsModels.municipalityName!,
        processing_errors: statisticsModels.processingErrors!,
        record_numbers_with_validation_errors: statisticsModels.recordNumbersWithValidationErrors!,
        record_validation_errors: this.mapToRecordValidationErrorModels(statisticsModels.recordValidationErrors!),
        source_system: statisticsModels.sourceSystem!,
        total_elapsed_milliseconds: this.mapToElapsedTime(statisticsModels.totalElapsedMilliseconds!),
        audit_info: AuditInfoService.map(statisticsModels.auditInfo!),
      }
      statistics.push(statistic);
    })
    return statistics;
  }

  private mapToRecordValidationErrorModels(recordValidationErrorModels: RecordValidationErrorModel[]): RecordValidationError[] {
    const recordValidationErrors: RecordValidationError[] = [];
    recordValidationErrorModels.forEach(recordValidationErrorModel => {
      const recordValidationError: RecordValidationError = {
        field: this.mapToFieldValidationErrorModel(recordValidationErrorModel.fields!),
        record_identifier: recordValidationErrorModel.recordIdentifier!,
        record_number: recordValidationErrorModel.recordNumber!
      }
      recordValidationErrors.push(recordValidationError);
    })
    return recordValidationErrors;
  }

  private mapToFieldValidationErrorModel(fileds: FieldValidationErrorModel[]): FieldValidationError[] {
    const fieldValidationErrorModels: FieldValidationError[] = [];
    fileds.forEach(field => {
      const fielValidationError: FieldValidationError = {
        errors: field.errors!,
        field_name: field.fieldName!
      }
      fieldValidationErrorModels.push(fielValidationError);
    })
    return fieldValidationErrorModels;
  }

  private mapToElapsedTime(milliseconds: string): string {
    let seconds = Number.parseInt(milliseconds.split(".")[0]) / 1000;
    const date = new Date(0, 0, 0, 0, 0, seconds);
    if (date.getSeconds() === 0) {
      date.setSeconds(1);
    }
    return date.getHours() + "h:" + date.getMinutes() + "m:" + date.getSeconds() + "s";
  }
}
