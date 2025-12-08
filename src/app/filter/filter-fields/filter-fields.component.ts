/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FilterCriteria, newFilterCriteria } from '../../models/filter/filterCriteria';
import { FilterCriteriaReferenceId } from '../../models/filter/filterCriteriaReferenceId';
import { KeyValuePairModel } from '../../models/keyValuePair.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputValidatorHelper } from '../../shared/helpers/input-validator.helper';
import { FilterChange, FilterOperation, FilterOperationId } from '@abraxas/base-components';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-filter-fields',
  templateUrl: './filter-fields.component.html',
  styleUrls: ['./filter-fields.component.scss'],
  standalone: false,
})
export class FilterFieldsComponent implements OnInit, OnChanges {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly roleService = inject(RoleService);

  protected readonly numberFilterOperations: FilterOperation[] = [
    {
      id: FilterOperationId.EQUALS,
      label: FilterOperationId.EQUALS,
      icon: FilterOperationId.EQUALS,
    },
  ];

  @Input()
  public criteria: FilterCriteria[] = [];

  @Input()
  public canSaveFilter: boolean = false;

  @Output()
  public resetCriteria: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public criteriaChange: EventEmitter<FilterCriteria[]> = new EventEmitter<FilterCriteria[]>();

  @Output()
  public searchEvent: EventEmitter<FilterCriteria[]> = new EventEmitter<FilterCriteria[]>();

  public isManager: boolean = false;
  public selectableAttributes: KeyValuePairModel[] = [];
  public filterForm: FormGroup = new FormGroup({});

  constructor() {
    this.buildForm();
  }

  public async ngOnInit(): Promise<void> {
    this.isManager = await this.roleService.isManager();
    this.updateAttributes();

    // VOTING-3928: convert string value to a boolean in order for checkboxes to initialize properly
    this.criteria.forEach((criteria: FilterCriteria) => {
      if (criteria.filterDataType === 'boolean') {
        criteria.filterValue = criteria.filterValue === 'true';
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['criteria'] !== undefined) {
      this.updateAttributes();
    }
  }

  public clearSearch(): void {
    this.resetCriteria.emit();
  }

  public triggerSearch(x?: SubmitEvent): void {
    x?.preventDefault();
    x?.stopPropagation();
    this.searchEvent.emit([...this.criteria]);
  }

  public async newFilter(): Promise<void> {
    await this.router.navigate(['-', 'filters', 'new', { criteria: true }]);
  }

  public addFilter(referenceId: FilterCriteriaReferenceId): void {
    this.criteria = [...this.criteria, newFilterCriteria(referenceId)];
    this.criteriaChange.emit(this.criteria);
  }

  public filterChange(event: FilterChange, filterCriteria: FilterCriteria): void {
    filterCriteria.filterOperator = event.operation;
    if (event.value !== null) {
      filterCriteria.filterValue = event.value;
    }
  }

  public isFilterControl(referenceId: string): boolean {
    switch (referenceId) {
      case FilterCriteriaReferenceId.age:
        return true;
    }
    return false;
  }

  public deleteCriteria(referenceId: string) {
    this.criteria = this.criteria.filter((c) => c.referenceId !== referenceId);
    this.criteriaChange.emit(this.criteria);
  }

  private updateAttributes(): void {
    const usedReferenceIds = this.criteria.map((x) => x.referenceId);
    this.selectableAttributes = Object.values(FilterCriteriaReferenceId)
      .filter((x) => !usedReferenceIds.includes(x))
      .map((refId, i) => new KeyValuePairModel(i, refId));
  }

  private buildForm(): void {
    this.filterForm = this.formBuilder.group({
      [FilterCriteriaReferenceId.vn]: ['', [Validators.pattern('^756\\.?\\d{4}\\.?\\d{4}\\.?\\d{2}$')]],
      [FilterCriteriaReferenceId.municipalityId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getNumeric()), Validators.max(9999)],
      ],
      [FilterCriteriaReferenceId.restrictedVotingAndElectionRightFederation]: [],
      [FilterCriteriaReferenceId.age]: [
        '18',
        [Validators.pattern(InputValidatorHelper.getNumeric()), Validators.max(150)],
      ],
      [FilterCriteriaReferenceId.swissCitizenship]: ['1'],
      [FilterCriteriaReferenceId.municipalityName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.officialName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.firstName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.religion]: [],
      [FilterCriteriaReferenceId.country]: [],
      [FilterCriteriaReferenceId.eVoting]: [],
      [FilterCriteriaReferenceId.sex]: [''],
      [FilterCriteriaReferenceId.dateOfBirth]: [
        '',
        [Validators.pattern(InputValidatorHelper.getExactDate())],
      ],
      [FilterCriteriaReferenceId.dateOfBirthAdjusted]: [''],
      [FilterCriteriaReferenceId.originalName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.allianceName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.aliasName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.otherName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.callName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.typeOfResidence]: [''],
      [FilterCriteriaReferenceId.originName1_7]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.originOnCanton1_7]: [
        '',
        [Validators.pattern(InputValidatorHelper.getAlpha()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.residencePermit]: [],
      [FilterCriteriaReferenceId.residencePermitValidFrom]: [
        '',
        [Validators.pattern(InputValidatorHelper.getExactDate())],
      ],
      [FilterCriteriaReferenceId.residencePermitValidTill]: [
        '',
        [Validators.pattern(InputValidatorHelper.getExactDate())],
      ],
      [FilterCriteriaReferenceId.residenceEntryDate]: [
        '',
        [Validators.pattern(InputValidatorHelper.getExactDate())],
      ],
      [FilterCriteriaReferenceId.contactAddressExtensionLine1]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.contactAddressExtensionLine2]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.contactAddressStreet]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.contactAddressHouseNumber]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.contactAddressPostOfficeBoxText]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.contactAddressLine1_7]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.contactAddressTown]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.contactAddressLocality]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.contactAddressZipCode]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.residenceAddressExtensionLine1]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.residenceAddressExtensionLine2]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.residenceAddressStreet]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.residenceAddressHouseNumber]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.residenceAddressPostOfficeBoxText]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.residenceAddressTown]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.residenceAddressZipCode]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.moveInArrivalDate]: [
        '',
        [Validators.pattern(InputValidatorHelper.getExactDate())],
      ],
      [FilterCriteriaReferenceId.moveInMunicipalityName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.moveInCantonAbbreviation]: [
        '',
        [Validators.pattern(InputValidatorHelper.getAlpha()), Validators.maxLength(20)],
      ],
      [FilterCriteriaReferenceId.moveInComesFrom]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.moveInCountryNameShort]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.moveInUnknown]: [''],
      [FilterCriteriaReferenceId.politicalCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.politicalCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.catholicCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.catholicCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.evangelicCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.evangelicCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.schoolCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.schoolCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.trafficCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.trafficCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.residentialDistrictCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.residentialDistrictCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.peopleCircleId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getSimpleSlText()), Validators.maxLength(50)],
      ],
      [FilterCriteriaReferenceId.peopleCircleName]: [
        '',
        [Validators.pattern(InputValidatorHelper.getComplexSlText()), Validators.maxLength(100)],
      ],
      [FilterCriteriaReferenceId.sendVotingCardsToDomainOfInfluenceReturnAddress]: [''],
      [FilterCriteriaReferenceId.isHouseholder]: [''],
      [FilterCriteriaReferenceId.residenceBuildingId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getNumeric()), Validators.min(1), Validators.max(999999999)],
      ],
      [FilterCriteriaReferenceId.residenceApartmentId]: [
        '',
        [Validators.pattern(InputValidatorHelper.getNumeric()), Validators.min(1), Validators.max(999)],
      ],
      [FilterCriteriaReferenceId.hasValidationErrors]: [''],
    });
  }
}
