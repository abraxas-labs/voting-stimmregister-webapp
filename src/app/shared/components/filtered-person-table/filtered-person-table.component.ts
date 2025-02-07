/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterCriteria } from '../../../models/filter/filterCriteria';
import { PersonSearchType } from '../../../models/person/personSearchParameters';

@Component({
  selector: 'app-filtered-person-table',
  templateUrl: './filtered-person-table.component.html',
})
export class FilteredPersonTableComponent {
  public currentCriteria: FilterCriteria[] = [];

  @Input()
  public pageIndex = 0;

  @Input()
  public pageSize = 20;

  @Input()
  public searchType: PersonSearchType = PersonSearchType.Person;

  @Output()
  public pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  public set criteria(c: FilterCriteria[]) {
    if (c !== this.currentCriteria) {
      this.currentCriteria = c;
      this.search(this.currentCriteria, false);
    }
  }

  @Input()
  public canSaveFilter: boolean = false;

  @Output()
  public readonly resetCriteria: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public readonly criteriaChange: EventEmitter<FilterCriteria[]> = new EventEmitter<FilterCriteria[]>();

  public search(criteria: FilterCriteria[], resetPage: boolean = true): void {
    if (resetPage && this.pageIndex !== 0) {
      this.pageIndex = 0;
      this.pageIndexChange.emit(0);
    }

    this.currentCriteria = criteria;
    this.criteriaChange.emit(this.currentCriteria);
  }

  public onCriteriaChanged(criteria: FilterCriteria[]) {
    this.currentCriteria = criteria;
    this.criteriaChange.emit(this.currentCriteria);
  }
}
