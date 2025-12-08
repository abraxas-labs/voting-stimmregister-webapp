/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterDefinition, newFilter } from '../../models/filter/filterDefinition';
import { FilterService } from '../../services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeletePopupComponent } from '../../shared/components/delete-popup/delete-popup.component';
import { InputValidatorHelper } from 'src/app/shared/helpers/input-validator.helper';
import { buildFilterDefaultCriteria } from '../../models/filter/filterCriteria';
import { Subscription } from 'rxjs';
import { TextComponent } from '@abraxas/base-components';
import { ToastService } from '../../services/toast.service';
import { PersonService } from '../../services/person.service';
import { PersonSearchType } from '../../models/person/personSearchParameters';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-filter',
  templateUrl: './handle-filter.component.html',
  styleUrls: ['./handle-filter.component.scss'],
  standalone: false,
})
export class HandleFilterComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly filterService = inject(FilterService);
  private readonly personService = inject(PersonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly toast = inject(ToastService);

  public readonly searchTypeFilter = PersonSearchType.Filter;

  public filterForm!: FormGroup;
  public filter?: FilterDefinition;
  public isNew: boolean = false;
  public isLoading: boolean = false;

  @ViewChild('name')
  public nameInput!: TextComponent;

  private paramsSubscription = Subscription.EMPTY;

  public async ngOnInit(): Promise<void> {
    this.initForm();
    this.paramsSubscription = this.route.params.subscribe((p) =>
      this.loadFilter(p.id, p.criteria, p.duplicated)
    );
  }

  public ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  public ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  public async navigateBack(): Promise<void> {
    await this.router.navigate(['..'], { relativeTo: this.route });
  }

  public async save(): Promise<void> {
    if (this.filter === undefined) {
      return;
    }

    this.isLoading = true;
    try {
      const name = this.filterForm.value.name;
      const description = this.filterForm.value.description;
      const id = await this.filterService.save(this.filter.id, name, description, this.filter.criteria);
      await this.router.navigate(['-', 'filters', id]);
      this.toast.success('shared.state.saved');
    } finally {
      this.isLoading = false;
    }
  }

  public async duplicate(): Promise<void> {
    if (this.filter === undefined) {
      return;
    }

    this.isLoading = true;
    try {
      const id = await this.filterService.duplicate(this.filter.id);
      await this.router.navigate(['-', 'filters', id, 'edit', { duplicated: true }]);
      this.toast.success('shared.action.duplicated');
    } finally {
      this.isLoading = false;
    }
  }

  public openDeletePopup(): void {
    if (this.filter === undefined) {
      return;
    }

    const filterId = this.filter.id;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      panelClass: 'custom-dialog-container',
      width: '500px',
      autoFocus: false,
      data: {
        context: 'filter',
        contextValue: this.filter.name,
      },
    });

    dialogRef.componentInstance.delete.subscribe(async () => {
      dialogRef.componentInstance.isLoading = true;
      try {
        await this.filterService.delete(filterId);
        dialogRef.close();
        await this.router.navigate(['-', 'filters']);
        this.toast.success('shared.state.deleted');
      } finally {
        dialogRef.componentInstance.isLoading = false;
      }
    });
  }

  public resetCriteria(): void {
    if (this.filter === undefined) {
      return;
    }

    this.filter.criteria = buildFilterDefaultCriteria();
  }

  private async loadFilter(
    id: string | null,
    loadCriteria: string | null,
    duplicated: string | null
  ): Promise<void> {
    if (!id) {
      this.isNew = true;
      const criteria = !!loadCriteria
        ? (await this.personService.getLastUsedParameters(PersonSearchType.Person, false)).criteria
        : buildFilterDefaultCriteria();
      this.filter = newFilter(criteria);
      return;
    }

    this.isNew = false;
    this.filter = await this.filterService.getSingle(id);
    this.filterForm.get('name')?.setValue(this.filter.name);
    this.filterForm.get('description')?.setValue(this.filter.description);
    if (!!duplicated) {
      this.nameInput.setFocus();
    }
  }

  private initForm(): void {
    this.filterForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(InputValidatorHelper.getComplexSlText()),
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(InputValidatorHelper.getComplexSlText()),
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      ],
    });
  }
}
