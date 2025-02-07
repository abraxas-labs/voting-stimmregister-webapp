/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, Output } from '@angular/core';
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
  RecordValidationErrorModel,
} from '@abraxas/voting-stimmregister-proto';
import { lastValueFrom } from 'rxjs';
import { ImportStatisticResponseModel } from '../models/data/importStatisticResponse.model';
import { ImportStatistic } from '../models/data/importStatistic.model';
import { RecordValidationError } from '../models/data/recordValidationError.model';
import { FieldValidationError } from '../models/data/fieldValidationError.model';
import { ImportType } from '../models/data/importType';
import { ImportStatusSimple } from '../models/data/ImportStatusSimple';
import { ImportSourceSystem } from '../models/data/importSourceSystem';
import { EventEmitter } from '@angular/core';
import { AuditInfoService } from './audit-info.service';

@Injectable({
  providedIn: 'root',
})
export class ImportStatisticService {
  @Output() public fetchImportStatitic: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly client: ImportStatisticServiceClient) {}

  public async getListOfImports(
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    source: ImportSource,
    state: ImportStatusSimple,
    pageIndex: number,
    pageSize: number
  ): Promise<ImportStatisticResponseModel> {
    return lastValueFrom(
      this.client.list(
        this.mapToListImportStatisticRequest(pageIndex, pageSize, type, sourceSystem, source, state)
      )
    ).then((l) => this.mapToImportStatisticList(l));
  }

  public async getHistoryOfImport(
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    municipalityId: number,
    pageIndex: number,
    pageSize: number
  ): Promise<ImportStatisticResponseModel> {
    const request = this.mapToImportStatisticHistoryRequest(
      pageIndex,
      pageSize,
      type,
      sourceSystem,
      municipalityId
    );
    return lastValueFrom(this.client.getHistory(request)).then((h) => this.mapToImportStatisticHistory(h));
  }

  private mapToListImportStatisticRequest(
    index: number,
    size: number,
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    source: ImportSource,
    state: ImportStatusSimple
  ): ListImportStatisticsRequest {
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

  private mapToImportStatisticList(
    listImportStatisticResponse: ListImportStatisticsResponse
  ): ImportStatisticResponseModel {
    return {
      totalCount: listImportStatisticResponse.totalCount!,
      importStatistics: this.mapToImportStatistics(listImportStatisticResponse.importStatistics!),
    };
  }

  private mapToImportStatisticHistoryRequest(
    index: number,
    size: number,
    type: ImportType,
    sourceSystem: ImportSourceSystem,
    municipalityId: number
  ): GetImportStatisticHistoryRequest {
    const req = new GetImportStatisticHistoryRequest();
    req.paging = new PagingModel();
    req.paging.pageIndex = index;
    req.paging.pageSize = size;
    req.municipalityId = municipalityId;
    req.importType = type;
    req.importSourceSystem = sourceSystem;
    return req;
  }

  private mapToImportStatisticHistory(
    importStatisticHistoryResponse: GetImportStatisticHistoryResponse
  ): ImportStatisticResponseModel {
    return {
      totalCount: importStatisticHistoryResponse.totalCount!,
      importStatistics: this.mapToImportStatistics(importStatisticHistoryResponse.importStatistics!),
    };
  }

  private mapToImportStatistics(importStatistics: ImportStatisticModel[]): ImportStatistic[] {
    const statistics: ImportStatistic[] = [];
    importStatistics.forEach((statisticsModels) => {
      const statistic: ImportStatistic = {
        datasetsCountCreated: statisticsModels.datasetsCountCreated!,
        datasetsCountDeleted: statisticsModels.datasetsCountDeleted!,
        datasetsCountUpdated: statisticsModels.datasetsCountUpdated!,
        entitiesWithValidationErrors: statisticsModels.entitiesWithValidationErrors!,
        finishedDate: statisticsModels.finishedDate?.toDate()!,
        hasValidationErrors: statisticsModels.hasValidationErrors!,
        id: statisticsModels.id!,
        importStatus: statisticsModels.importStatus!,
        importType: statisticsModels.importType!,
        importRecordsCountTotal: statisticsModels.importRecordsCountTotal!,
        municipalityId: statisticsModels.municipalityId!,
        municipalityName: statisticsModels.municipalityName!,
        processingErrors: statisticsModels.processingErrors!,
        recordNumbersWithValidationErrors: statisticsModels.recordNumbersWithValidationErrors!,
        recordValidationErrors: this.mapToRecordValidationErrorModels(
          statisticsModels.recordValidationErrors!
        ),
        sourceSystem: statisticsModels.sourceSystem!,
        totalElapsedMilliseconds: this.mapToElapsedTime(statisticsModels.totalElapsedMilliseconds!),
        auditInfo: AuditInfoService.map(statisticsModels.auditInfo!),
      };
      statistics.push(statistic);
    });
    return statistics;
  }

  private mapToRecordValidationErrorModels(
    recordValidationErrorModels: RecordValidationErrorModel[]
  ): RecordValidationError[] {
    const recordValidationErrors: RecordValidationError[] = [];
    recordValidationErrorModels.forEach((recordValidationErrorModel) => {
      const recordValidationError: RecordValidationError = {
        field: this.mapToFieldValidationErrorModel(recordValidationErrorModel.fields!),
        recordIdentifier: recordValidationErrorModel.recordIdentifier!,
        recordNumber: recordValidationErrorModel.recordNumber!,
      };
      recordValidationErrors.push(recordValidationError);
    });
    return recordValidationErrors;
  }

  private mapToFieldValidationErrorModel(fileds: FieldValidationErrorModel[]): FieldValidationError[] {
    const fieldValidationErrorModels: FieldValidationError[] = [];
    fileds.forEach((field) => {
      const fielValidationError: FieldValidationError = {
        errors: field.errors!,
        fieldName: field.fieldName!,
      };
      fieldValidationErrorModels.push(fielValidationError);
    });
    return fieldValidationErrorModels;
  }

  private mapToElapsedTime(milliseconds: string): string {
    let seconds = Number.parseInt(milliseconds.split('.')[0]) / 1000;
    const date = new Date(0, 0, 0, 0, 0, seconds);
    if (date.getSeconds() === 0) {
      date.setSeconds(1);
    }
    return date.getHours() + 'h:' + date.getMinutes() + 'm:' + date.getSeconds() + 's';
  }
}
