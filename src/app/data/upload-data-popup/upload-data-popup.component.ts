/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ErrorHandler, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropdownItem, FileWithProgress } from '@abraxas/base-components';
import { ImportType } from '../../models/data/importType';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { ImportSourceSystem } from '../../models/data/importSourceSystem';
import { AccessRole } from '../../models/accessRole';
import { RoleService } from '../../services/role.service';
import { filterAsync } from '../../shared/helpers/array.helper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const typeOffset = 100;

interface UploadDialogData {
  supportedSourceSystems: ImportSourceSystem[];
}

interface DropdownItemWithRole extends DropdownItem {
  role?: AccessRole;
  sourceSystem?: ImportSourceSystem;
}

@Component({
  selector: 'app-upload-data-popup',
  templateUrl: './upload-data-popup.component.html',
  styleUrls: ['./upload-data-popup.component.scss'],
  standalone: false,
})
export class UploadDataPopupComponent implements OnInit {
  public readonly data = inject<UploadDialogData>(MAT_DIALOG_DATA);
  private readonly translate = inject(TranslateService);
  private readonly dataService = inject(DataService);
  private readonly errorHandler = inject(ErrorHandler);
  private readonly dialogRef = inject<MatDialogRef<UploadDataPopupComponent>>(MatDialogRef);
  private readonly role = inject(RoleService);
  private readonly toastService = inject(ToastService);

  public readonly maxUploadFileSize: number = 600 * 1024 * 1024; // 600MB

  public uploadFileData?: FileWithProgress[];
  public fileData?: FileWithProgress;
  public selectedTypeSystemId?: string;
  public uploading: boolean = false;

  private selectedImportType?: ImportType;
  private selectedImportSourceSystem?: ImportSourceSystem;
  public allowedFileExtension: '.csv' | '.xml' = '.csv';
  public allowedFileType: 'text/csv' | 'text/xml' = 'text/csv';
  public isFileValidForUpload: boolean = false;

  public uploadTypes: DropdownItemWithRole[] = [
    {
      id: '' + (ImportType.IMPORT_TYPE_PERSON * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO),
      displayValue: this.translate.instant('upload-data.dropdown.swiss'),
      disabled: false,
      role: AccessRole.ApiImporter,
      sourceSystem: ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO,
    },
    {
      id: '' + (ImportType.IMPORT_TYPE_PERSON * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA),
      displayValue: this.translate.instant('upload-data.dropdown.swissAbroad'),
      disabled: false,
      sourceSystem: ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA,
    },
    {
      id:
        '' + (ImportType.IMPORT_TYPE_PERSON * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA_TG),
      displayValue: this.translate.instant('upload-data.dropdown.swissAbroadTg'),
      disabled: false,
      sourceSystem: ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA_TG,
    },
    {
      id:
        '' +
        (ImportType.IMPORT_TYPE_DOMAIN_OF_INFLUENCE * typeOffset +
          ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO),
      displayValue: this.translate.instant('upload-data.dropdown.doiLoganto'),
      disabled: false,
      role: AccessRole.ApiImporter,
      sourceSystem: ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO,
    },
    {
      id:
        '' + (ImportType.IMPORT_TYPE_PERSON * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_INNOSOLV),
      displayValue: this.translate.instant('upload-data.dropdown.innosolvPersons'),
      disabled: false,
      role: AccessRole.ApiImporter,
      sourceSystem: ImportSourceSystem.IMPORT_SOURCE_SYSTEM_INNOSOLV,
    },
  ];

  @Output() public uploaded: EventEmitter<any> = new EventEmitter();

  public async ngOnInit(): Promise<void> {
    // Filter by role first
    this.uploadTypes = await filterAsync(this.uploadTypes, (ut) =>
      ut.role === undefined ? Promise.resolve(true) : this.role.hasAnyRoles(ut.role)
    );

    // Then filter by supported source systems
    if (this.data?.supportedSourceSystems) {
      this.uploadTypes = this.uploadTypes.filter(
        (ut) => ut.sourceSystem === undefined || this.data.supportedSourceSystems.includes(ut.sourceSystem)
      );
    }

    if (this.uploadTypes.length > 0) {
      this.selectedTypeSystemId = this.uploadTypes[0].id;
      this.updateSelectedTypeSystem(this.selectedTypeSystemId);
    }
  }

  public updateFileData(event: FileWithProgress[]): void {
    if (event) {
      this.fileData = event.pop();
    } else {
      this.fileData = undefined;
    }
    if (this.fileData) {
      this.uploadFileData?.push(this.fileData);
    }

    this.isFileValidForUpload =
      this.fileData != null &&
      this.fileData.file.type === this.allowedFileType &&
      this.fileData.file.size < this.maxUploadFileSize;
  }

  public async upload(): Promise<void> {
    if (
      this.selectedImportType === undefined ||
      this.selectedImportSourceSystem === undefined ||
      !this.fileData
    ) {
      return;
    }

    try {
      this.uploading = true;
      this.dialogRef.disableClose = true;
      await this.dataService.uploadData(
        this.selectedImportType,
        this.selectedImportSourceSystem,
        this.fileData.file
      );
      this.dialogRef.close();
      this.toastService.success('shared.state.uploaded');
      this.uploaded.emit();
    } catch (e) {
      this.errorHandler.handleError(e);
    } finally {
      this.dialogRef.disableClose = false;
      this.uploading = false;
    }
  }

  public updateSelectedTypeSystem(selectedTypeSystemId: number | string): void {
    const typeId = +selectedTypeSystemId;
    this.selectedImportSourceSystem = typeId % typeOffset;
    this.selectedImportType = (typeId / typeOffset) >> 0;

    switch (this.selectedImportSourceSystem) {
      case ImportSourceSystem.IMPORT_SOURCE_SYSTEM_INNOSOLV:
        this.allowedFileExtension = '.xml';
        this.allowedFileType = 'text/xml';
        break;
      default:
        this.allowedFileExtension = '.csv';
        this.allowedFileType = 'text/csv';
        break;
    }
  }
}
