/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ErrorHandler, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { DropdownItem } from "@abraxas/base-components";
import { ImportType } from "../../models/data/importType";
import { DataService } from "../../services/data.service";
import { ToastService } from "../../services/toast.service";
import { ImportSourceSystem } from "../../models/data/importSourceSystem";
import { AccessRole } from "../../models/accessRole";
import { RoleService } from "../../services/role.service";
import { filterAsync } from "../../shared/helpers/array.helper";

const typeOffset = 100;

interface DropdownItemWithRole extends DropdownItem {
  role?: AccessRole;
}

@Component({
  selector: 'app-upload-data-popup',
  templateUrl: './upload-data-popup.component.html',
  styleUrls: ['./upload-data-popup.component.scss']
})
export class UploadDataPopupComponent implements OnInit {
  private readonly maxUploadFileSize: number = 600 * 1024 * 1024; // 600MB

  public uploadFile?: File[];
  public file?: File;
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
    },
    {
      id: '' + (ImportType.IMPORT_TYPE_PERSON * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_COBRA),
      displayValue: this.translate.instant('upload-data.dropdown.swissAbroad'),
      disabled: false,
    },
    {
      id: '' + (ImportType.IMPORT_TYPE_DOMAIN_OF_INFLUENCE * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_LOGANTO),
      displayValue: this.translate.instant('upload-data.dropdown.doiLoganto'),
      disabled: false,
      role: AccessRole.ApiImporter,
    },
    {
      id: '' + (ImportType.IMPORT_TYPE_PERSON * typeOffset + ImportSourceSystem.IMPORT_SOURCE_SYSTEM_INNOSOLV),
      displayValue: this.translate.instant('upload-data.dropdown.innosolvPersons'),
      disabled: false,
      role: AccessRole.ApiImporter,
    }
  ]

  @Output() public uploaded: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly translate: TranslateService,
    private readonly dataService: DataService,
    private readonly errorHandler: ErrorHandler,
    private readonly dialogRef: MatDialogRef<UploadDataPopupComponent>,
    private readonly role: RoleService,
    private readonly toastService: ToastService) {
  }

  public async ngOnInit(): Promise<void> {
    this.uploadTypes = await filterAsync(this.uploadTypes, ut => ut.role === undefined
      ? Promise.resolve(true)
      : this.role.hasAnyRoles(ut.role));
    this.selectedTypeSystemId = this.uploadTypes[0].id;
    this.updateSelectedTypeSystem(this.selectedTypeSystemId);
  }

  public updateFile(event: File[]): void {
    if (event) {
      this.file = event.pop();
    } else {
      this.file = undefined;
    }
    if (this.file) {
      this.uploadFile?.push(this.file);
    }

    this.isFileValidForUpload = this.file != null && this.file.type === this.allowedFileType && this.file.size < this.maxUploadFileSize;
  }

  public async upload(): Promise<void> {
    if (this.selectedImportType === undefined
      || this.selectedImportSourceSystem === undefined
      || !this.file) {
      return;
    }

    try {
      this.uploading = true;
      this.dialogRef.disableClose = true;
      await this.dataService.uploadData(this.selectedImportType, this.selectedImportSourceSystem, this.file);
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
