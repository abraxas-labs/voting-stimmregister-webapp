/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FilterDefinition } from "../../../models/filter/filterDefinition";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InputValidatorHelper } from "../../../shared/helpers/input-validator.helper";
import { FilterVersion } from "../../../models/filter/filterVersion";
import { FilterService } from "../../../services/filter.service";
import { ToastService } from "../../../services/toast.service";

export interface HandleVersionPopupData {
  filter: FilterDefinition;
  version?: FilterVersion;
  countOfInvalidPersons?: number;
}

@Component({
  selector: 'app-handle-version-popup',
  templateUrl: './handle-version-popup.component.html',
  styleUrls: ['./handle-version-popup.component.scss']
})
export class HandleVersionPopupComponent {

  public readonly isNew: boolean;
  public isLoading: boolean = false;
  public readonly version: FilterVersion;
  public readonly filter: FilterDefinition;
  public readonly versionForm: FormGroup;

  @Output()
  public saveEvent: EventEmitter<void> = new EventEmitter<void>();

  private readonly now: Date = new Date();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: HandleVersionPopupData,
    private readonly filterService: FilterService,
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<HandleVersionPopupComponent>,
    private readonly toast: ToastService) {
    this.filter = data.filter;
    this.version = data.version ?? {
      count: 0,
      countOfInvalidPersons: data.countOfInvalidPersons ?? 0,
      audit_info: {
        created_by_name: '',
        modified_by_name: undefined,
        created_at: this.now,
        modified_at: undefined,
      },
      criteria: [],
      deadline: new Date(),
      id: '',
      name: ''
    };
    this.isNew = data.version === undefined;
    this.versionForm = this.buildForm();
  }

  public async save(): Promise<void> {
    this.isLoading = true;
    try {
      // bc-date returns the date as string in the format yyyy-mm-dd
      const deadline = new Date(this.versionForm.get('date')!.value);
      const name = this.versionForm.get('description')!.value;
      if (this.isNew) {
        await this.create(name, deadline);
      } else {
        await this.rename(name);
      }
    } finally {
      this.isLoading = false;
    }
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      description: ['', [Validators.required, Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.minLength(2), Validators.maxLength(150)]],
      date: ['', Validators.pattern(InputValidatorHelper.getExactDate())]
    })
  }

  private async create(name: string, deadline: Date): Promise<void> {
    await this.filterService.createVersion(this.filter.id, name, deadline);
    this.afterSave();
  }

  private async rename(name: string): Promise<void> {
    if (!this.version) {
      return;
    }

    await this.filterService.renameVersion(this.version.id, name)
    await this.afterSave();
  }

  private afterSave(): void {
    this.saveEvent.emit();
    this.dialogRef.close();
    this.toast.success('shared.state.saved');
  }
}
