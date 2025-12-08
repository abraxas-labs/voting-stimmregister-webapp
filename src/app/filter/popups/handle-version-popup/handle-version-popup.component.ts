/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FilterDefinition } from '../../../models/filter/filterDefinition';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputValidatorHelper } from '../../../shared/helpers/input-validator.helper';
import { FilterVersion } from '../../../models/filter/filterVersion';
import { FilterService } from '../../../services/filter.service';
import { ToastService } from '../../../services/toast.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface HandleVersionPopupData {
  filter: FilterDefinition;
  version?: FilterVersion;
  countOfInvalidPersons?: number;
}

@Component({
  selector: 'app-handle-version-popup',
  templateUrl: './handle-version-popup.component.html',
  styleUrls: ['./handle-version-popup.component.scss'],
  standalone: false,
})
export class HandleVersionPopupComponent {
  private readonly filterService = inject(FilterService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject<MatDialogRef<HandleVersionPopupComponent>>(MatDialogRef);
  private readonly toast = inject(ToastService);

  public readonly isNew: boolean;
  public isLoading: boolean = false;
  public readonly version: FilterVersion;
  public readonly filter: FilterDefinition;
  public readonly versionForm: FormGroup;

  @Output()
  public saveEvent: EventEmitter<void> = new EventEmitter<void>();

  private readonly now: Date = new Date();

  constructor() {
    const data = inject<HandleVersionPopupData>(MAT_DIALOG_DATA);

    this.filter = data.filter;
    this.version = data.version ?? {
      count: 0,
      countOfInvalidPersons: data.countOfInvalidPersons ?? 0,
      auditInfo: {
        createdByName: '',
        modifiedByName: undefined,
        createdAt: this.now,
        modifiedAt: undefined,
      },
      criteria: [],
      deadline: new Date(),
      id: '',
      name: '',
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
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(InputValidatorHelper.getComplexSlText()),
          Validators.minLength(2),
          Validators.maxLength(150),
        ],
      ],
      date: ['', Validators.pattern(InputValidatorHelper.getExactDate())],
    });
  }

  private async create(name: string, deadline: Date): Promise<void> {
    await this.filterService.createVersion(this.filter.id, name, deadline);
    this.afterSave();
  }

  private async rename(name: string): Promise<void> {
    if (!this.version) {
      return;
    }

    await this.filterService.renameVersion(this.version.id, name);
    await this.afterSave();
  }

  private afterSave(): void {
    this.saveEvent.emit();
    this.dialogRef.close();
    this.toast.success('shared.state.saved');
  }
}
